const express = require('express');
const validator = require('validator');
const { collection, doc, getDoc, arrayUnion, runTransaction } = require('firebase/firestore');
const rateLimit = require('express-rate-limit');
const Ably = require('ably');

const db = require('../../../firebase-config'); 
const router = express.Router();
const verifyToken = require('../../middleware/auth/verifyToken'); 

// Initialize Ably client
const ably = new Ably.Realtime(process.env.ABLY_API_KEY);
const bidChannel = ably.channels.get('biddar');

const bidLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 5, 
});

router.post('/', bidLimiter, verifyToken, async (req, res) => {
  try {
    const { userId, amount, productId } = req.body;

    // Validate input
    if (!productId || !amount) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (!validator.isLength(productId, { min: 1 }) || !validator.isLength(userId, { min: 1 })) {
      return res.status(400).json({ message: 'Invalid product or user ID format' });
    }
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    // Check product existence
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);
    if (!productSnap.exists()) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const productData = productSnap.data();

    const now = new Date();
    const startTime = new Date(productData.startTime);
    const endTime = new Date(productData.endTime);

    // Validate bidding time and status
    if (['cancelled', 'closed', 'coming soon'].includes(productData.status) ||
        now < startTime || now > endTime) {
      return res.status(400).json({ message: 'Bidding is not allowed.' });
    }

    if (amount <= productData.startPrice) {
      return res.status(400).json({ message: 'Bid must exceed the starting price.' });
    }

    // Create and save bid in Firestore
    const newBid = { productId, userId, amount, timestamp: new Date() };
    const bidsCollection = collection(db, 'bids');

    await runTransaction(db, async (transaction) => {
      const bidRef = doc(bidsCollection); 
      transaction.set(bidRef, newBid); 

      transaction.update(productRef, {
        bids: arrayUnion(bidRef.id),
      });

      const currentHighestBid = productData.highestBid || productData.startPrice;
      if (amount > currentHighestBid) {
        transaction.update(productRef, { highestBid: amount });
      } else {
        throw new Error('Bid must exceed the current highest bid.');
      }
    });

    // Publish new bid event via Ably
    bidChannel.publish('new-bid', newBid, (err) => {
      if (err) {
        console.error('Failed to publish bid:', err);
        return res.status(500).json({ message: 'Failed to notify bid event' });
      }
      console.log('Bid event published successfully:', newBid);
    });

    res.status(201).json({ message: 'Bid placed successfully' });
  } catch (error) {
    console.error('Error placing bid:', error);
    if (error.message === 'Bid must exceed the current highest bid.') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to place bid' });
  }
});

module.exports = router;
