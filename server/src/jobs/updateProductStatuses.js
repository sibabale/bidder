const admin = require('../config/firebase-admin');
const moment = require('moment');
const setBuyer = require('../crons/products/setBuyer');
const { PRODUCT_STATUS } = require('../constants/productStatus');
const { log } = require('../lib/logger');

const db = admin.firestore();

const ACTIVE_STATUSES = [PRODUCT_STATUS.COMING_SOON, PRODUCT_STATUS.LIVE, 'coming soon'];

async function fetchActiveProducts() {
  const [activeSnap, legacySnap] = await Promise.all([
    db.collection('products').where('status', 'in', ACTIVE_STATUSES.slice(0, 2)).get(),
    db.collection('products').where('status', '==', 'coming soon').get(),
  ]);

  const byId = new Map();
  for (const doc of activeSnap.docs) {
    byId.set(doc.id, doc);
  }
  for (const doc of legacySnap.docs) {
    byId.set(doc.id, doc);
  }
  return [...byId.values()];
}

async function updateProductStatuses() {
  const productDocs = await fetchActiveProducts();
  const now = moment();

  for (const productDoc of productDocs) {
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
      log('info', 'Product status updated', { productId, status: newStatus });
    }
  }
}

module.exports = { updateProductStatuses, fetchActiveProducts };
