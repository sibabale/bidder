const { 
  doc, 
  where,
  query,
  getDoc,
  addDoc, 
  getDocs, 
  collection,
} = require('firebase/firestore');
const express = require('express');
const { body, validationResult } = require('express-validator');

const db = require('../../../firebase-config');
const router = express.Router();
const verifyToken = require('../../middleware/auth/verifyToken');

router.post(
  '/',
  verifyToken,
  [
    body('image').isURL().withMessage('Image must be a valid URL'),
    body('title').notEmpty().withMessage('Title is required'),
    body('userId').isLength({ min: 28, max: 28 }).withMessage('Invalid user ID format'), // Adjusted for non-UUID IDs
    body('endTime').isISO8601().toDate().withMessage('Invalid end time'),
    body('startTime').isISO8601().toDate().withMessage('Invalid start time'),
    body('startPrice').isFloat({ gt: 0 }).withMessage('Start price must be a positive number'),
    body('description').notEmpty().withMessage('Description is required'),
    body('incrementPrice').isFloat({ gt: 0 }).withMessage('Increment price must be a positive number'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      image, 
      title, 
      userId, 
      endTime,
      startTime, 
      startPrice, 
      description, 
      incrementPrice, 
    } = req.body;

    try {
      // Validate that endTime is after startTime
      if (endTime <= startTime) {
        return res.status(400).json({ message: 'End time must be after start time' });
      }

        // Check if the user exists by querying the document by ID
        const userDocRef = doc(collection(db, 'users'), userId);
        const userDoc = await getDoc(userDocRef);
  
        if (!userDoc.exists()) {
          return res.status(404).json({ message: 'User does not exist' });
        }

      // Check if the user already has a product with the same title
      const productsQuery = query(
        collection(db, 'products'),
        where('title', '==', title),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(productsQuery);

      if (!querySnapshot.empty) {
        return res.status(400).json({ message: 'You already have a product with this title' });
      }

      // Determine product status based on the current time
      const now = new Date();
      let status;
      if (now < startTime) {
        status = 'coming_soon';
      } else if (now >= startTime && now <= endTime) {
        status = 'live';
      } else {
        status = 'closed';
      }

      // Save product to Firestore
      const newProduct = {
        title,
        userId,
        startPrice: parseFloat(startPrice),
        description,
        incrementPrice: parseFloat(incrementPrice),
        image,
        startTime,
        endTime,
        status,
        timestamp: new Date(),
      };

      const productRef = await addDoc(collection(db, 'products'), newProduct);

      res.status(201).json({ 
        message: 'Product uploaded successfully', 
        productId: productRef.id 
      });
    } catch (error) {
      console.error('Error uploading product:', error);
      res.status(500).json({ message: 'Failed to upload product' });
    }
  }
);

module.exports = router;
