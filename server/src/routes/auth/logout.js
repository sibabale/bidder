const express = require('express');
const jwt = require('jsonwebtoken');
const redisClient = require('../../config/redis-client');
const verifyToken = require('../../middleware/auth/verifyToken');
const { sendError } = require('../../lib/apiResponse');
const { logError, logStep } = require('../../lib/logger');
const { authLimiter } = require('../../middleware/rateLimits');

const router = express.Router();

router.post('/', authLimiter, verifyToken, async (req, res) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      return sendError(res, 401, 'UNAUTHORIZED', 'No token provided');
    }

    logStep(req, 'logout', 'blacklisting token...', { uid: req.auth?.uid });
    const decoded = jwt.decode(token);
    const expiresIn = decoded?.exp
      ? Math.max(decoded.exp - Math.floor(Date.now() / 1000), 1)
      : 3600;

    try {
      await redisClient.setEx(token, expiresIn, 'blacklisted');
    } catch (err) {
      logError(req, 'Error blacklisting token in Redis', err);
      return sendError(res, 500, 'LOGOUT_FAILED', 'Could not blacklist token');
    }

    logStep(req, 'logout', 'logout successful...', { uid: req.auth?.uid });
    res.status(200).json({ code: 'LOGOUT_OK', message: 'Logout successful' });
  } catch (error) {
    logError(req, 'Error signing out user', error);
    return sendError(res, 500, 'LOGOUT_FAILED', 'Failed to sign out');
  }
});

module.exports = router;
