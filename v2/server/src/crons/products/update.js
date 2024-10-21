const cron = require('node-cron');
const { collection, getDocs, doc, updateDoc } = require('firebase/firestore');
const db = require('../../../firebase-config'); 
const moment = require('moment'); // Import moment

// Function to update product statuses
const updateProductStatuses = async () => {
  try {
    const productsRef = collection(db, 'products');
    const productsSnapshot = await getDocs(productsRef);

    const now = moment(); // Current time using moment

    // Loop through each product and update status based on time
    for (const productDoc of productsSnapshot.docs) {
      const productData = productDoc.data();
      const productId = productDoc.id;


      // Parse start and end times using moment
      const startTime = moment(productData.startTime);
      const endTime = moment(productData.endTime);

      let newStatus;

      // Determine new status based on the current time
      if (now.isBefore(startTime)) {
        newStatus = 'coming soon'; // Before start time
      } else if (now.isAfter(endTime)) {
        newStatus = 'closed'; // After end time
      } else {
        newStatus = 'live'; // Within bidding time
      }

      // Check if the new status is different from the current status
      if (newStatus !== productData.status) {
        // Update the product status if changed
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
