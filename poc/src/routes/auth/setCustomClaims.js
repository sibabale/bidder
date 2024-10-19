const admin = require('../../config/firebase-admin'); // Adjust the path as necessary
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { uid } = req.body;

  try {
    // Set custom claim for the user
    await admin.auth().setCustomUserClaims(uid, { isLoggedIn: true });
    res.status(200).json({ message: 'Custom claims set successfully.' });
  } catch (error) {
    console.error('Error setting custom claims:', error);
    res.status(500).json({ message: 'Failed to set custom claims.' });
  }
});

module.exports = router;
