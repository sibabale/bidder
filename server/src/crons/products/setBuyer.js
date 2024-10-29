
const { collection, getDocs ,getDoc,  query, where, doc, updateDoc } = require('firebase/firestore');
const db = require('../../../firebase-config');

// Function to find the highest bidder and update the product with buyer details
const setBuyer = async (productId) => {
  try {

    const productDoc = await getDoc(doc(db, 'products', productId));
    const productData = productDoc.data();

    if (productData.buyer) {
      console.log(`Buyer already set for product ${productId}, skipping...`);
      return; 
    }
    
    const bidsQuery = query(collection(db, 'bids'), where('productId', '==', productId));
    const bidsSnapshot = await getDocs(bidsQuery);

    if (bidsSnapshot.empty) {
      console.log(`No bids found for product ${productId}`);
      return;
    }

    let highestBid = null;
    bidsSnapshot.forEach((bidDoc) => {
      const bidData = bidDoc.data();
      if (!highestBid || bidData.amount > highestBid.amount) {
        highestBid = { ...bidData, id: bidDoc.id };
      }
    });

    if (highestBid) {
      const { userId, amount, timestamp } = highestBid;

      const userDocRef = doc(db, 'users', userId); 
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        console.error(`User with ID ${userId} does not exist.`);
        return;
      }
      const userData = userDoc.data();

      const buyer = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        bid: { amount, timestamp },
      };

      await updateDoc(doc(db, 'products', productId), { buyer });

      console.log(`Set buyer for product ${productId}:`, buyer);
    }
  } catch (error) {
    console.error('Error setting buyer:', error);
  }
};

module.exports = setBuyer;
