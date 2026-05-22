const express = require('express');
const { ComplyCube } = require('@complycube/api');
const { getKycSession } = require('../../lib/kycSession');
const { identityCheckLimiter } = require('../../middleware/rateLimits');

const router = express.Router();

router.post('/', identityCheckLimiter, async (req, res) => {
  const { data, clientId } = req.body;

  if (!clientId || !data?.documentCapture?.documentId || !data?.faceCapture?.liveVideoId) {
    return res.status(400).json({ message: 'Invalid identity check payload' });
  }

  const session = await getKycSession(clientId);
  if (!session) {
    return res.status(403).json({
      message: 'KYC session expired or invalid. Restart verification from registration.',
    });
  }

  try {
    const complycube = new ComplyCube({ apiKey: process.env.COMPLYCUBE_API_KEY });

    const check = await complycube.check.create(clientId, {
      type: 'enhanced_identity_check',
      documentId: data.documentCapture.documentId,
      liveVideoId: data.faceCapture.liveVideoId,
      enableMonitoring: true,
    });

    const getCheck = await complycube.check.get(check.id);

    res.status(200).json({ result: getCheck.result.outcome, clientId });
  } catch (error) {
    console.error('Error checking identity:', error);
    res.status(500).json({ message: 'Failed to check identity' });
  }
});

module.exports = router;
