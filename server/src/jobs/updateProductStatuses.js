const admin = require('../config/firebase-admin');
const moment = require('moment');
const setBuyer = require('../crons/products/setBuyer');

const db = admin.firestore();

async function updateProductStatuses() {
  const productsSnap = await db.collection('products').get();
  const now = moment();

  for (const productDoc of productsSnap.docs) {
    const productData = productDoc.data();
    const productId = productDoc.id;

    const startTime = moment(productData.startTime);
    const endTime = moment(productData.endTime);

    let newStatus;

    if (now.isBefore(startTime)) {
      newStatus = 'coming soon';
    } else if (now.isAfter(endTime)) {
      newStatus = 'closed';
      await setBuyer(productId);
    } else {
      newStatus = 'live';
    }

    if (newStatus !== productData.status) {
      await db.collection('products').doc(productId).update({ status: newStatus });
      console.log(`Updated product ${productId} status to ${newStatus}`);
    }
  }
}

module.exports = { updateProductStatuses };
