const express = require('express');
const { updateProductStatuses } = require('../../jobs/updateProductStatuses');

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
    await updateProductStatuses();
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Cron updateProductStatuses failed:', error);
    return res.status(500).json({ message: 'Cron job failed' });
  }
});

module.exports = router;
