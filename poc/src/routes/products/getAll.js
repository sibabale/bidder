const express = require('express');
const { collection, getDocs } = require('firebase/firestore');
const db = require('../../../firebase-config'); 

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const productsCollection = collection(db, 'products');
    const productsSnapshot = await getDocs(productsCollection); 

    // Map the fetched data into an array of product objects
    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id, // Firestore document ID
      ...doc.data(), // All other product fields
    }));

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

module.exports = router;
