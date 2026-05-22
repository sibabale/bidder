const express = require('express');
const { body, validationResult } = require('express-validator');
const admin = require('../../config/firebase-admin');
const { publishBid } = require('../../lib/ably');
const { parseBidAmount } = require('../../lib/parseBidAmount');
const { sendError, sendValidationErrors } = require('../../lib/apiResponse');
const { logError } = require('../../lib/logger');
const { captureError } = require('../../lib/monitoring');
const { BLOCKED_BID_STATUSES } = require('../../constants/productStatus');
const { bidLimiter } = require('../../middleware/rateLimits');
const verifyToken = require('../../middleware/auth/verifyToken');

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;
const router = express.Router();

router.post(
  '/',
  bidLimiter,
  verifyToken,
  [
    body('productId').notEmpty().withMessage('productId is required'),
    body('userId').notEmpty().withMessage('userId is required'),
    body('amount')
      .custom((value) => parseBidAmount(value) !== null)
      .withMessage('amount must be a positive number'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendValidationErrors(res, errors);
    }

    try {
      const { userId, amount: rawAmount, productId } = req.body;

      if (userId !== req.auth.uid) {
        return sendError(res, 403, 'FORBIDDEN', 'User ID does not match authenticated user');
      }

      const amount = parseBidAmount(rawAmount);
      const productRef = db.collection('products').doc(productId);
      const bidRef = db.collection('bids').doc();
      const bidTimestamp = new Date();

      await db.runTransaction(async (transaction) => {
        const productSnap = await transaction.get(productRef);
        if (!productSnap.exists) {
          throw Object.assign(new Error('Product not found'), { code: 'NOT_FOUND' });
        }

        const productData = productSnap.data();
        const now = new Date();
        const startTime = new Date(productData.startTime);
        const endTime = new Date(productData.endTime);

        if (BLOCKED_BID_STATUSES.includes(productData.status) || now < startTime || now > endTime) {
          throw Object.assign(new Error('Bidding is not allowed.'), { code: 'BID_CLOSED' });
        }

        if (amount <= productData.startPrice) {
          throw Object.assign(new Error('Bid must exceed the starting price.'), { code: 'BID_LOW' });
        }

        const currentHighestBid = productData.highestBid || productData.startPrice;
        if (amount <= currentHighestBid) {
          throw Object.assign(new Error('Bid must exceed the current highest bid.'), {
            code: 'BID_NOT_HIGHEST',
          });
        }

        const bidRecord = {
          bidId: bidRef.id,
          productId,
          userId,
          amount,
          timestamp: bidTimestamp,
        };

        transaction.set(bidRef, bidRecord);
        transaction.update(productRef, {
          bids: FieldValue.arrayUnion(bidRef.id),
          highestBid: amount,
        });
      });

      const newBid = {
        bidId: bidRef.id,
        productId,
        userId,
        amount,
        timestamp: bidTimestamp,
      };

      try {
        await publishBid(productId, newBid);
      } catch (publishError) {
        logError(req, 'Failed to publish bid to Ably', publishError, { productId });
        captureError(publishError, { productId, requestId: req.id });
        return res.status(503).json({
          code: 'BROADCAST_FAILED',
          message: 'Bid saved but live update failed. Refresh to see the latest state.',
          bid: newBid,
          broadcast: false,
        });
      }

      res.status(201).json({
        code: 'BID_PLACED',
        message: 'Bid placed successfully',
        bid: newBid,
        broadcast: true,
      });
    } catch (error) {
      logError(req, 'Error placing bid', error);
      if (error.code === 'NOT_FOUND') {
        return sendError(res, 404, 'NOT_FOUND', 'Product not found');
      }
      if (error.code === 'BID_CLOSED') {
        return sendError(res, 400, 'BID_CLOSED', 'Bidding is not allowed.');
      }
      if (error.code === 'BID_LOW' || error.code === 'BID_NOT_HIGHEST') {
        return sendError(res, 400, error.code, error.message);
      }
      captureError(error, { requestId: req.id, route: 'POST /api/bids' });
      return sendError(res, 500, 'BID_FAILED', 'Failed to place bid');
    }
  }
);

module.exports = router;
