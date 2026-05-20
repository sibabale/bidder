const express = require('express');
const { EventVerifier } = require('@complycube/api');
const admin = require('../../config/firebase-admin');

const db = admin.firestore();
const router = express.Router();

router.post('/', async (req, res) => {
  const webhookSecret = process.env.COMPLYCUBE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(503).json({ message: 'COMPLYCUBE_WEBHOOK_SECRET is not configured' });
  }

  const signature = req.headers['complycube-signature'];
  if (!signature) {
    return res.status(400).json({ message: 'Missing complycube-signature header' });
  }

  if (!req.rawBody) {
    return res.status(400).json({ message: 'Missing raw request body for signature verification' });
  }

  const rawBody = req.rawBody.toString('utf8');

  try {
    const eventVerifier = new EventVerifier(webhookSecret);
    const event = eventVerifier.constructEvent(rawBody, signature);

    switch (event.type) {
      case 'check.completed': {
        const { id: checkId, outcome, clientId } = event.payload;
        await db.collection('kycChecks').doc(checkId).set(
          {
            checkId,
            clientId: clientId || null,
            outcome: outcome || null,
            status: 'completed',
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );

        if (clientId) {
          const usersSnap = await db
            .collection('users')
            .where('complycubeClientId', '==', clientId)
            .limit(1)
            .get();

          if (!usersSnap.empty) {
            const kycStatus = outcome === 'clear' ? 'verified' : 'rejected';
            await usersSnap.docs[0].ref.update({
              kycStatus,
              kycUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
          }
        }
        break;
      }
      case 'check.pending': {
        const { id: checkId, clientId } = event.payload;
        await db.collection('kycChecks').doc(checkId).set(
          {
            checkId,
            clientId: clientId || null,
            status: 'pending',
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
        break;
      }
      default:
        console.warn('Unhandled ComplyCube webhook event type:', event.type);
        break;
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('ComplyCube webhook error:', error);
    return res.status(400).json({ message: `Webhook Error: ${error.message}` });
  }
});

module.exports = router;
