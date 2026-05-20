const admin = require('../config/firebase-admin');
const moment = require('moment');
const setBuyer = require('../crons/products/setBuyer');
const { PRODUCT_STATUS } = require('../constants/productStatus');

const db = admin.firestore();

async function updateProductStatuses() {
  const productsSnap = await db.collection('products').get();
  const now = moment();

  for (const productDoc of productsSnap.docs) {
    const productData = productDoc.data();
    const productId = productDoc.id;

    if (productData.status === 'coming soon') {
      await db.collection('products').doc(productId).update({ status: PRODUCT_STATUS.COMING_SOON });
      productData.status = PRODUCT_STATUS.COMING_SOON;
    }

    const startTime = moment(productData.startTime);
    const endTime = moment(productData.endTime);

    let newStatus;

    if (now.isBefore(startTime)) {
      newStatus = PRODUCT_STATUS.COMING_SOON;
    } else if (now.isAfter(endTime)) {
      newStatus = PRODUCT_STATUS.CLOSED;
      await setBuyer(productId);
    } else {
      newStatus = PRODUCT_STATUS.LIVE;
    }

    if (newStatus !== productData.status) {
      await db.collection('products').doc(productId).update({ status: newStatus });
      console.log(`Updated product ${productId} status to ${newStatus}`);
    }
  }
}

module.exports = { updateProductStatuses };
