const express = require('express');
const { ComplyCube } = require('@complycube/api');
const { storeKycSession } = require('../../lib/kycSession');

require('dotenv').config();

const { kycTokenLimiter } = require('../../middleware/rateLimits');

const router = express.Router();

router.post('/', kycTokenLimiter, async (req, res) => {
  const { email, firstName, lastName } = req.body;

  if (!email || !firstName || !lastName) {
    return res.status(400).json({ message: 'email, firstName, and lastName are required' });
  }

  try {
    const complycube = new ComplyCube({
      apiKey: process.env.COMPLYCUBE_API_KEY,
    });

    const client = await complycube.client.create({
      type: 'person',
      email,
      personDetails: {
        firstName,
        lastName,
      },
    });

    await storeKycSession(client.id, { email, firstName, lastName });

    const token = await complycube.token.generate(client.id, {
      referrer: '*://*/*',
    });

    res.status(200).json({ clientId: client.id, token });
  } catch (error) {
    console.error('Error generating KYC token:', error);
    res.status(500).json({ message: 'Failed to generate KYC token' });
  }
});

module.exports = router;
