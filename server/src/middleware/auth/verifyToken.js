
const jwt = require('jsonwebtoken');
const redisClient = require('../../config/redis-client');

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Check if token is in the blacklist
        const isBlacklisted = await redisClient.get(token);

        if (isBlacklisted) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Verify token
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        console.error('Authorization error:', error);
        res.status(403).json({ message: 'Unauthorized' });
    }
};

module.exports = verifyToken;

