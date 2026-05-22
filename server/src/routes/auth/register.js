require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const { body, validationResult } = require('express-validator');
const { registerLimiter } = require('../../middleware/rateLimits');
const admin = require('../../config/firebase-admin');

const db = admin.firestore();
const router = express.Router();

const isValidPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

router.post(
  '/',
  registerLimiter,
  [
    body('email').isEmail().withMessage('Please provide a valid email address.'),
    body('firstName').notEmpty().withMessage('First name is required.'),
    body('lastName').notEmpty().withMessage('Last name is required.'),
    body('password').custom((value) => {
      if (!isValidPassword(value)) {
        throw new Error(
          'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, and a number.'
        );
      }
      return true;
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName } = req.body;

    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: `${firstName} ${lastName}`.trim(),
      });

      const { uid, metadata } = userRecord;
      const creationTime = metadata.creationTime;
      const lastSignInTime = metadata.lastSignInTime || null;

      const jwtToken = jwt.sign({ uid, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      const { complycubeClientId } = req.body;

      await db.collection('users').doc(uid).set({
        uid,
        bids: [],
        email,
        lastName,
        products: [],
        firstName,
        creationTime,
        emailVerified: userRecord.emailVerified || false,
        lastSignInTime,
        ...(complycubeClientId ? { complycubeClientId } : {}),
        kycStatus: complycubeClientId ? 'verified' : 'unverified',
      });

      res.status(201).json({
        message: 'User registered successfully',
        userId: uid,
        jwtToken,
      });
    } catch (error) {
      console.error('Error registering user:', error);
      if (error.code === 'auth/email-already-exists') {
        return res.status(400).json({ message: 'An account with this email already exists.' });
      }
      if (error.code === 'auth/invalid-password') {
        return res.status(400).json({ message: 'Password does not meet Firebase requirements.' });
      }
      res.status(500).json({
        message: 'Failed to register user',
        error: error.message,
      });
    }
  }
);

module.exports = router;
