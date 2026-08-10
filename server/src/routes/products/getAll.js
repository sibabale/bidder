const express = require('express');
const admin = require('../../config/firebase-admin');

const db = admin.firestore();
const verifyToken = require('../../middleware/auth/verifyToken');
const { logError, logStep } = require('../../lib/logger');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    const productsSnapshot = await db.collection('products').get();

    const products = productsSnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

module.exports = router;
