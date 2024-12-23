const express = require('express');
const redisClient = require('../../config/redis-client');

const router = express.Router();

router.post('/', async (req, res) => {
    
    try {
          const token = req.headers.authorization?.split('Bearer ')[1];

          if (!token) {
              return res.status(401).json({ message: 'No token provided' });
          }
  
          // Calculate TTL as the difference between expiration time and current time
          const ttl = 500;
  
  
          // Set the token in Redis with a TTL
          await redisClient.setex(token, ttl, 'blacklisted').catch((err) => {
              console.error('Error blacklisting token in Redis:', err);
              return res
                  .status(HttpStatusCode.INTERNAL_SERVER)
                  .json({ error: 'Could not blacklist token' });
          });
  
          res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error signing out user:', error);
        return res.status(500).json({ message: 'Failed to sign out', error: error.message });
    }
});

module.exports = router;
