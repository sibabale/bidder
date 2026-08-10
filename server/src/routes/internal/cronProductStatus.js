const express = require('express');
const { updateProductStatuses } = require('../../jobs/updateProductStatuses');
const { log, logError } = require('../../lib/logger');

const router = express.Router();

router.get('/update-product-statuses', async (req, res) => {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return res.status(503).json({ message: 'CRON_SECRET is not configured' });
  }

  const auth = req.headers.authorization;
  if (auth !== `Bearer ${secret}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    log('info', '[cron/updateProductStatuses] vercel cron triggered...');
    await updateProductStatuses();
    log('info', '[cron/updateProductStatuses] vercel cron complete...');
    return res.status(200).json({ ok: true });
  } catch (error) {
    logError(undefined, 'Cron updateProductStatuses failed', error);
    return res.status(500).json({ message: 'Cron job failed' });
  }
});

module.exports = router;
