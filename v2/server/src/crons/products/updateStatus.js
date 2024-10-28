
const cron = require('node-cron');
const { collection, getDocs, doc, updateDoc } = require('firebase/firestore');
const db = require('../../../firebase-config'); 
const moment = require('moment');
const setBuyer = require('./setBuyer');

const updateProductStatuses = async () => {
  try {
    const productsRef = collection(db, 'products');
    const productsSnapshot = await getDocs(productsRef);

    const now = moment();

    for (const productDoc of productsSnapshot.docs) {
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
        await updateDoc(doc(db, 'products', productId), { status: newStatus });
        console.log(`Updated product ${productId} status to ${newStatus}`);
      }
    }
  } catch (error) {
    console.error('Error updating product statuses:', error);
  }
};

// Schedule the cron job to run every minute
cron.schedule('* * * * *', updateProductStatuses);
