const moment = require('moment-timezone');
const express = require('express');
const { body, validationResult } = require('express-validator');
const admin = require('../../config/firebase-admin');
const { PRODUCT_STATUS } = require('../../constants/productStatus');

const db = admin.firestore();
const router = express.Router();
const verifyToken = require('../../middleware/auth/verifyToken');
const { productCreateLimiter } = require('../../middleware/rateLimits');

const booleanOrEmpty = (value) => {
  if (value === '' || typeof value === 'boolean') {
    return true;
  }
  throw new Error('Must be a boolean');
};

router.post(
  '/',
  productCreateLimiter,
  verifyToken,
  [
    body('image').isURL().withMessage('Image must be a valid URL'),
    body('title').notEmpty().withMessage('Title is required'),
    body('frame').optional().isBoolean().withMessage('Frame must be a boolean'),
    body('medium').notEmpty().withMessage('Medium is required'),
    body('userId').isLength({ min: 28, max: 28 }).withMessage('Invalid user ID format'),
    body('endDate').isISO8601().withMessage('Invalid end date'),
    body('subTitle').notEmpty().withMessage('Subtitle is required'),
    body('signature').optional().custom(booleanOrEmpty),
    body('startDate').isISO8601().withMessage('Invalid start date'),
    body('startPrice').isFloat({ gt: 0 }).withMessage('Start price must be a positive number'),
    body('certificate').optional().custom(booleanOrEmpty),
    body('description').notEmpty().withMessage('Description is required'),
    body('endTime').custom((value) => {
      if (!value || typeof value.hour !== 'number' || typeof value.minute !== 'number') {
        throw new Error('Invalid end time format');
      }
      return true;
    }),
    body('startTime').custom((value) => {
      if (!value || typeof value.hour !== 'number' || typeof value.minute !== 'number') {
        throw new Error('Invalid start time format');
      }
      return true;
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      image,
      title,
      frame,
      medium,
      userId,
      endDate,
      endTime,
      subTitle,
      startDate,
      startTime,
      signature,
      dimensions,
      startPrice,
      certificate,
      description,
    } = req.body;

    if (userId !== req.auth.uid) {
      return res.status(403).json({ message: 'User ID does not match authenticated user' });
    }

    try {
      const startDateTime = moment.tz(`${startDate}`, 'Africa/Johannesburg').set({
        hour: startTime.hour,
        minute: startTime.minute,
        second: startTime.second,
        millisecond: startTime.millisecond,
      });

      const endDateTime = moment.tz(`${endDate}`, 'Africa/Johannesburg').set({
        hour: endTime.hour,
        minute: endTime.minute,
        second: endTime.second,
        millisecond: endTime.millisecond,
      });

      if (endDateTime.isBefore(startDateTime)) {
        return res.status(400).json({ message: 'End time must be after start time' });
      }

      const userDoc = await db.collection('users').doc(userId).get();

      if (!userDoc.exists) {
        return res.status(404).json({ message: 'User does not exist' });
      }

      const duplicateSnap = await db
        .collection('products')
        .where('title', '==', title)
        .where('userId', '==', userId)
        .limit(1)
        .get();

      if (!duplicateSnap.empty) {
        return res.status(400).json({ message: 'You already have a product with this title' });
      }

      const now = new Date();
      let status;
      if (now < startDateTime.toDate()) {
        status = PRODUCT_STATUS.COMING_SOON;
      } else if (now >= startDateTime.toDate() && now <= endDateTime.toDate()) {
        status = PRODUCT_STATUS.LIVE;
      } else {
        status = PRODUCT_STATUS.CLOSED;
      }

      const newProduct = {
        title,
        image,
        userId,
        status,
        frame,
        medium,
        endTime: endDateTime.toISOString(),
        subTitle,
        startTime: startDateTime.toISOString(),
        timestamp: new Date(),
        signature,
        dimensions,
        startPrice: parseFloat(startPrice),
        highestBid: parseFloat(startPrice),
        certificate,
        description,
      };

      const productRef = await db.collection('products').add(newProduct);

      res.status(201).json({
        message: 'Product uploaded successfully',
        productId: productRef.id,
      });
    } catch (error) {
      console.error('Error uploading product:', error);
      res.status(500).json({ message: 'Failed to upload product' });
    }
  }
);

module.exports = router;
