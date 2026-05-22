const jwt = require('jsonwebtoken');
const redisClient = require('../../config/redis-client');
const { sendError } = require('../../lib/apiResponse');
const { logError } = require('../../lib/logger');

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
      return sendError(res, 401, 'UNAUTHORIZED', 'No token provided');
    }

    const isBlacklisted = await redisClient.get(token);

    if (isBlacklisted) {
      return sendError(res, 401, 'UNAUTHORIZED', 'Invalid token');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = decoded;
    next();
  } catch (error) {
    logError(req, 'Authorization error', error);
    return sendError(res, 403, 'FORBIDDEN', 'Unauthorized');
  }
};

module.exports = verifyToken;
