const express = require('express');
const redisClient = require('../config/redis-client');

const router = express.Router();

router.get('/', async (req, res) => {
  const checks = { api: 'ok' };
  let status = 200;

  try {
    const pong = await redisClient.ping();
    checks.redis = pong === 'PONG' ? 'ok' : 'degraded';
    if (checks.redis !== 'ok') {
      status = 503;
    }
  } catch (error) {
    checks.redis = 'unavailable';
    status = 503;
  }

  res.status(status).json({
    status: status === 200 ? 'ok' : 'degraded',
    checks,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
