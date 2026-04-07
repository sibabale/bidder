const express = require('express');
const validator = require('validator');
const { rateLimit } = require('express-rate-limit');
const Ably = require('ably');
const admin = require('../../config/firebase-admin');

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;
const router = express.Router();
const verifyToken = require('../../middleware/auth/verifyToken');

const ably = new Ably.Realtime(process.env.ABLY_API_KEY);
const bidChannel = ably.channels.get('biddar');

const bidLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
});

const BLOCKED_STATUSES = ['cancelled', 'closed', 'coming soon', 'coming_soon'];

router.post('/', bidLimiter, verifyToken, async (req, res) => {
  try {
    const { userId, amount, productId } = req.body;

    if (!productId || !amount) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (!validator.isLength(productId, { min: 1 }) || !validator.isLength(userId, { min: 1 })) {
      return res.status(400).json({ message: 'Invalid product or user ID format' });
    }
    if (userId !== req.auth.uid) {
      return res.status(403).json({ message: 'User ID does not match authenticated user' });
    }
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    const productRef = db.collection('products').doc(productId);
    const bidTimestamp = new Date();
    const newBid = { productId, userId, amount, timestamp: bidTimestamp };

    await db.runTransaction(async (transaction) => {
      const productSnap = await transaction.get(productRef);
      if (!productSnap.exists) {
        throw Object.assign(new Error('Product not found'), { code: 'NOT_FOUND' });
      }

      const productData = productSnap.data();
      const now = new Date();
      const startTime = new Date(productData.startTime);
      const endTime = new Date(productData.endTime);

      if (BLOCKED_STATUSES.includes(productData.status) || now < startTime || now > endTime) {
        throw Object.assign(new Error('Bidding is not allowed.'), { code: 'BID_CLOSED' });
      }

      if (amount <= productData.startPrice) {
        throw Object.assign(new Error('Bid must exceed the starting price.'), { code: 'BID_LOW' });
      }

      const currentHighestBid = productData.highestBid || productData.startPrice;
      if (amount <= currentHighestBid) {
        throw Object.assign(new Error('Bid must exceed the current highest bid.'), { code: 'BID_NOT_HIGHEST' });
      }

      const bidRef = db.collection('bids').doc();

      transaction.set(bidRef, newBid);
      transaction.update(productRef, {
        bids: FieldValue.arrayUnion(bidRef.id),
        highestBid: amount,
      });
    });

    bidChannel.publish('new-bid', newBid, (err) => {
      if (err) {
        console.error('Failed to publish bid:', err);
      } else {
        console.log('Bid event published successfully:', newBid);
      }
    });

    res.status(201).json({ message: 'Bid placed successfully' });
  } catch (error) {
    console.error('Error placing bid:', error);
    if (error.code === 'NOT_FOUND') {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (error.code === 'BID_CLOSED') {
      return res.status(400).json({ message: 'Bidding is not allowed.' });
    }
    if (error.code === 'BID_LOW' || error.code === 'BID_NOT_HIGHEST') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to place bid' });
  }
});

module.exports = router;
