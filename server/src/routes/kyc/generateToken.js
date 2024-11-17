const express = require('express');
const { ComplyCube } = require("@complycube/api");
require('dotenv').config();

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, firstName, lastName } = req.body;

  try {
  
    const complycube = new ComplyCube({ 
      apiKey: process.env.COMPLYCUBE_API_KEY
    });
    
    const client = await complycube.client.create({
      type: "person",
      email,
      personDetails: {
        firstName,
        lastName,
      } 
    });
    
    const token = await complycube.token.generate(client.id, {
      referrer: "*://*/*"
    })

    res.status(200).json({ clientId: client.id, token });

  } catch (error) {
    console.error('Error generating KYC token:', error);
    res.status(500).json({ message: 'Failed to generate KYC token' });
  }
});

module.exports = router;
