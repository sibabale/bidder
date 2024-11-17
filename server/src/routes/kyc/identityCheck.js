const express = require('express');
const { ComplyCube } = require("@complycube/api");


const router = express.Router();

const registerLimiter = rateLimit({
  windowMs: 20 * 60 * 1000, // 20 minutes
  max: 3  , // Limit each IP to 3 identity checks per windowMs
  message: 'Too many identity checks from this IP, please try again later.',
});

router.post('/', registerLimiter, async (req, res) => {

  const {data, clientId} = req.body
  
  try {

    const complycube = new ComplyCube({ apiKey: process.env.COMPLYCUBE_API_KEY });

    const check = await complycube.check.create(clientId, {
      type: 'enhanced_identity_check',
      documentId: data.documentCapture.documentId,
      liveVideoId: data.faceCapture.liveVideoId,
      enableMonitoring: true,
    });

    const getCheck = await complycube.check.get(check.id);

    res.status(200).json({ result: getCheck.result.outcome });
    
  } catch (error) {
    console.error('Error checking identity:', error);
    res.status(500).json({ message: 'Failed to check identity' });
  }
});

module.exports = router;
