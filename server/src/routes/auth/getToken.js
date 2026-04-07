const express = require('express');
const jwt = require('jsonwebtoken');
const verifyToken = require('../../middleware/auth/verifyToken');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  if (userId !== req.auth.uid) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  try {
    const jwtToken = jwt.sign(
      { uid: req.auth.uid, email: req.auth.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Token issued.', token: jwtToken });
  } catch (error) {
    console.error('Error issuing token:', error);
    return res.status(500).json({ message: 'Failed to issue token', error: error.message });
  }
});

module.exports = router;
