const express = require('express');
const { doc, getDoc } = require('firebase/firestore');

const db = require('../../../firebase-config');

const router = express.Router();

// GET /api/products/:productId
router.get('/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    // Fetch product from Firestore using the product ID
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Return product data
    res.status(200).json(productSnap.data());
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

module.exports = router;
