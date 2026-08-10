const jwt = require('jsonwebtoken');
const redisClient = require('../../config/redis-client');
const { sendError } = require('../../lib/apiResponse');
const { logError, logStep } = require('../../lib/logger');

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      logStep(req, 'verifyToken', 'no token provided...');
      return sendError(res, 401, 'UNAUTHORIZED', 'No token provided');
    }

    const isBlacklisted = await redisClient.get(token);

    if (isBlacklisted) {
      logStep(req, 'verifyToken', 'token is blacklisted...');
      return sendError(res, 401, 'UNAUTHORIZED', 'Invalid token');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = decoded;
    logStep(req, 'verifyToken', 'token verified...', { uid: decoded.uid });
    next();
  } catch (error) {
    logError(req, 'Authorization error', error);
    return sendError(res, 403, 'FORBIDDEN', 'Unauthorized');
  }
};

module.exports = verifyToken;
