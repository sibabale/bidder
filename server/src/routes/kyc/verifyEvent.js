const express = require('express');
const { EventVerifier } = require('@complycube/api')

const verifyToken = require('../../middleware/auth/verifyToken');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {

    // Provide your webhook secret to the EventVerifier 
    const webhookSecret = process.env.COMPLYCUBE_WEBHOOK_SECRET;
    const eventVerifier = new EventVerifier(webhookSecret);
    
    // This example uses Express to receive webhooks
    const app = require('express')();
    
    // Use body-parser to retrieve the raw body as a buffer
    const bodyParser = require('body-parser');
    
    // Match the raw body to content type application/json
    app.post('/webhook', bodyParser.json(), (request, response) => {
      const signature = request.headers['complycube-signature'];
    
      let event;
    
      try {
        event = eventVerifier.constructEvent(
          JSON.stringify(request.body),
          signature
        );
      }
      catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
      }
    
      // Handle the event
      switch (event.type) {
        case 'check.completed': {
          const checkId = event.payload.id;
          const checkOutCome = event.payload.outcome;
          // console.log(`Check ${checkId} completed with outcome ${checkOutCome}`);
          break;
        }
        case 'check.pending': {
          const checkId = event.payload.id;
          // console.log(`Check ${checkId} is pending`);
          break;
        }
        // ... handle other event types
        default: {
          // Unexpected event type
          return response.status(400).end();
        }
      }
    
      // Return a response to acknowledge receipt of the event
      response.json({received: true});
    });
    
    app.listen(4242, () => console.log('Running on port 4242'));
  } catch (error) {
    console.error('Error verifying event:', error);
    res.status(500).json({ message: 'Failed to verify event' });
  }
});

module.exports = router;
