const express = require('express');
const admin = require('../config/firebase-admin');
const redisClient = require('../config/redis-client');
const { getRestClient } = require('../lib/ably');

const router = express.Router();

router.get('/', async (req, res) => {
  const checks = { api: 'ok' };
  let status = 200;

  checks.firebase = admin.apps.length > 0 ? 'ok' : 'unavailable';
  if (checks.firebase !== 'ok') {
    status = 503;
  }

  try {
    const pong = await redisClient.ping();
    checks.redis = pong === 'PONG' ? 'ok' : 'degraded';
    if (checks.redis !== 'ok') {
      status = 503;
    }
  } catch {
    checks.redis = 'unavailable';
    status = 503;
  }

  if (process.env.ABLY_API_KEY) {
    try {
      getRestClient();
      checks.ably = 'ok';
    } catch {
      checks.ably = 'unavailable';
      status = 503;
    }
  } else {
    checks.ably = 'not_configured';
    status = 503;
  }

  res.status(status).json({
    status: status === 200 ? 'ok' : 'degraded',
    checks,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
