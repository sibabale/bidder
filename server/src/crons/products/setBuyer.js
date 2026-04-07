const admin = require('../../config/firebase-admin');

const db = admin.firestore();

async function setBuyer(productId) {
  try {
    const productDoc = await db.collection('products').doc(productId).get();
    const productData = productDoc.data();

    if (!productData) {
      return;
    }

    if (productData.buyer) {
      console.log(`Buyer already set for product ${productId}, skipping...`);
      return;
    }

    const bidsSnap = await db.collection('bids').where('productId', '==', productId).get();

    if (bidsSnap.empty) {
      console.log(`No bids found for product ${productId}`);
      return;
    }

    let highestBid = null;
    bidsSnap.forEach((bidDoc) => {
      const bidData = bidDoc.data();
      if (!highestBid || bidData.amount > highestBid.amount) {
        highestBid = { ...bidData, id: bidDoc.id };
      }
    });

    if (highestBid) {
      const { userId, amount, timestamp } = highestBid;

      const userDoc = await db.collection('users').doc(userId).get();

      if (!userDoc.exists) {
        console.error(`User with ID ${userId} does not exist.`);
        return;
      }
      const userData = userDoc.data();

      const buyer = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        bid: { amount, timestamp },
      };

      await db.collection('products').doc(productId).update({ buyer });

      console.log(`Set buyer for product ${productId}:`, buyer);
    }
  } catch (error) {
    console.error('Error setting buyer:', error);
  }
}

module.exports = setBuyer;
