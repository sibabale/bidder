const express = require('express');
const { body, validationResult } = require('express-validator');
const { collection, addDoc, query, where, getDocs } = require('firebase/firestore');
const db = require('../../firebase-config');


const router = express.Router();


// Handle HTTP POST request to upload a product
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('userId').isUUID().withMessage('Invalid user ID format'),
    body('startPrice').isFloat({ gt: 0 }).withMessage('Start price must be a positive number'),
    body('description').notEmpty().withMessage('Description is required'),
    body('incrementPrice').isFloat({ gt: 0 }).withMessage('Increment price must be a positive number'),
    body('image').isURL().withMessage('Image must be a valid URL'),
  ],
  async (req, res) => {
    const errors = validationResult(req); // Check for validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Send errors back to the user
    }

    const { title, userId, startPrice, description, incrementPrice, image } = req.body;

    try {
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

      // Save product to Firestore
      const newProduct = {
        title,
        userId,
        startPrice: parseFloat(startPrice),
        description,
        incrementPrice: parseFloat(incrementPrice),
        image,
        timestamp: new Date(),
      };

      const productRef = await addDoc(collection(db, 'products'), newProduct);

      res.status(201).json({ message: 'Product uploaded successfully', productId: productRef.id });
    } catch (error) {
      console.error('Error uploading product:', error);
      res.status(500).json({ message: 'Failed to upload product' });
    }
  }
);


module.exports = router; 