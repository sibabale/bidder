const express = require('express');
const { collection, doc, getDoc, arrayUnion, runTransaction } = require('firebase/firestore');
const db = require('../../../firebase-config'); 
const rateLimit = require('express-rate-limit');
const validator = require('validator');

const router = express.Router();

// Rate limiting middleware
const bidLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 bids per window
});

// Handle HTTP POST request to place a bid
router.post('/', bidLimiter, async (req, res) => {
  try {
    const { productId, userId, amount } = req.body;

    // Input validation
    if (!productId || !userId || !amount) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (!validator.isLength(productId, { min: 1 }) || !validator.isUUID(userId)) {
      return res.status(400).json({ message: 'Invalid product or user ID format' });
    }
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    // Check product existence and fetch its details
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);
    if (!productSnap.exists()) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const productData = productSnap.data();

    // Check if the product is live and within the bidding time
    const now = new Date();
    const startTime = new Date(productData.startTime);
    const endTime = new Date(productData.endTime);

    // Block bidding on certain product statuses
    if (['cancelled', 'closed', 'coming soon'].includes(productData.status)) {
      return res.status(400).json({ message: `Bidding is not allowed on ${productData.status} products.` });
    }

    // Additional time checks
    if (now < startTime) {
      return res.status(400).json({ message: 'Bidding is not allowed before the start time.' });
    }
    if (now > endTime) {
      return res.status(400).json({ message: 'Bidding has ended for this product.' });
    }

    // Check if the bid amount is greater than the start price
    if (amount <= productData.startPrice) {
      return res.status(400).json({ message: 'Bid amount must be greater than the starting price' });
    }

    // Save bid to Firestore and update the product document within a transaction
    const newBid = { productId, userId, amount, timestamp: new Date() };
    const bidsCollection = collection(db, 'bids');

    // Use transaction to ensure atomic operations
    await runTransaction(db, async (transaction) => {
      // Create a new bid document
      const bidRef = doc(bidsCollection); // Create a new document reference
      transaction.set(bidRef, newBid); // Set the new bid document

      // Update the product document with the new bid ID
      transaction.update(productRef, {
        bids: arrayUnion(bidRef.id),
      });

      // Update highest bid amount if the new bid is greater than the current highest bid amount
      const currentHighestBidAmount = productData.highestBidAmount || productData.startPrice;

      if (amount > currentHighestBidAmount) {
        // Update the highest bid amount
        transaction.update(productRef, {
          highestBidAmount: amount,
        });
      } else {
        // Throw an error if the bid is not higher than the current highest bid
        throw new Error('Bid amount must be higher than the current highest bid amount');
      }
    });

    // Broadcast new bid over WebSocket
    req.io.emit('new_bid', { ...newBid });

    res.status(201).json({ message: 'Bid placed successfully' });
  } catch (error) {
    console.error('Error placing bid:', error);
    // Check if the error is due to bid being too low
    if (error.message === 'Bid amount must be higher than the current highest bid amount') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to place bid' });
  }
});

module.exports = router;
