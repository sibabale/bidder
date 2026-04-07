require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const { validationResult, body } = require('express-validator');
const admin = require('../../config/firebase-admin');
const { signInWithPassword } = require('../../lib/signInWithPassword');

const db = admin.firestore();
const router = express.Router();

router.post(
  '/',
  [
    body('email').isEmail().withMessage('Please provide a valid email address.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const { localId } = await signInWithPassword(email, password);

      const userDoc = await db.collection('users').doc(localId).get();

      if (!userDoc.exists) {
        return res.status(404).json({ message: 'User not found in the database.' });
      }

      const userData = userDoc.data();

      const jwtToken = jwt.sign(
        { uid: localId, email: userData.email || email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({
        message: 'Login successful',
        user: {
          email: userData.email,
          userId: localId,
          firstName: userData.firstName,
          lastName: userData.lastName,
        },
        jwtToken,
      });
    } catch (error) {
      console.error('Error logging in user:', error);
      if (error.code === 'auth/wrong-password') {
        return res.status(401).json({ message: 'Invalid password. Please try again.' });
      }
      if (error.code === 'auth/user-not-found') {
        return res.status(404).json({ message: 'No user found with this email.' });
      }
      if (error.code === 'auth/invalid-credential') {
        return res.status(404).json({ message: 'Invalid email or password.' });
      }
      if (error.code === 'auth/user-disabled') {
        return res.status(403).json({ message: 'This account has been disabled.' });
      }
      if (error.code === 'config') {
        return res.status(500).json({ message: 'Server authentication is misconfigured.' });
      }
      return res.status(500).json({ message: 'Failed to log in user', error: error.message });
    }
  }
);

module.exports = router;
