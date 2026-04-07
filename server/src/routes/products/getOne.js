const express = require('express');
const admin = require('../../config/firebase-admin');

const db = admin.firestore();
const router = express.Router();
const verifyToken = require('../../middleware/auth/verifyToken');

router.get('/:productId', verifyToken, async (req, res) => {
  const { productId } = req.params;

  try {
    const productSnap = await db.collection('products').doc(productId).get();

    if (!productSnap.exists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(productSnap.data());
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

module.exports = router;
