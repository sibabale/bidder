require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const { validationResult, body } = require('express-validator');
const admin = require('../../config/firebase-admin');
const { signInWithPassword } = require('../../lib/signInWithPassword');
const { sendError, sendValidationErrors } = require('../../lib/apiResponse');
const { logError } = require('../../lib/logger');
const { authLimiter } = require('../../middleware/rateLimits');

const db = admin.firestore();
const router = express.Router();

router.post(
  '/',
  authLimiter,
  [
    body('email').isEmail().withMessage('Please provide a valid email address.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendValidationErrors(res, errors);
    }

    const { email, password } = req.body;

    try {
      const { localId } = await signInWithPassword(email, password);

      const userDoc = await db.collection('users').doc(localId).get();

      if (!userDoc.exists) {
        return sendError(res, 404, 'USER_NOT_FOUND', 'User not found in the database.');
      }

      const userData = userDoc.data();

      const jwtToken = jwt.sign(
        { uid: localId, email: userData.email || email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({
        code: 'LOGIN_OK',
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
      logError(req, 'Error logging in user', error);
      if (error.code === 'auth/wrong-password') {
        return sendError(res, 401, 'INVALID_CREDENTIALS', 'Invalid password. Please try again.');
      }
      if (error.code === 'auth/user-not-found') {
        return sendError(res, 404, 'USER_NOT_FOUND', 'No user found with this email.');
      }
      if (error.code === 'auth/invalid-credential') {
        return sendError(res, 404, 'INVALID_CREDENTIALS', 'Invalid email or password.');
      }
      if (error.code === 'auth/user-disabled') {
        return sendError(res, 403, 'USER_DISABLED', 'This account has been disabled.');
      }
      if (error.code === 'config') {
        return sendError(res, 500, 'AUTH_MISCONFIGURED', 'Server authentication is misconfigured.');
      }
      return sendError(res, 500, 'LOGIN_FAILED', 'Failed to log in user');
    }
  }
);

module.exports = router;
