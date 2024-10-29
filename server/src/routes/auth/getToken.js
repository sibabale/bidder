// const express = require('express');
// const { doc, getDoc } = require('firebase/firestore');
// const db = require('../../../firebase-config'); // Your Firestore config

// const router = express.Router();

// // Endpoint to get the user's Firebase token
// router.get('/', async (req, res) => {
//     console.log("-------------------------------");
    
//     console.log("req.query", req.query);
//     const { userId } = req.query; // or use req.body if you're sending user ID in the body

//     if (!userId) {
//         return res.status(400).json({ message: 'User ID is required.' });
//     }

//     try {
//         const userDocRef = doc(db, 'users', userId);
//         const userDoc = await getDoc(userDocRef);

//         if (!userDoc.exists()) {
//             return res.status(404).json({ message: 'User not found.' });
//         }

//         const user = userDoc.data();
//         console.log("user", user);
        
//         const firebaseToken = await user.getIdToken(); // Assuming user is logged in

//         res.status(200).json({ firebaseToken });
//     } catch (error) {
//         console.error('Error fetching token:', error);
//         return res.status(500).json({ message: 'Failed to retrieve token', error: error.message });
//     }
// });

// module.exports = router;
const express = require('express');
const { doc, getDoc } = require('firebase/firestore');
const { getAuth } = require('firebase-admin/auth'); // Import Firebase Admin SDK
const db = require('../../../firebase-config'); // Your Firestore config
const admin = require('../../config/firebase-admin'); 

const router = express.Router();

// Endpoint to get the user's Firebase token
router.get('/', async (req, res) => {
    
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const user = userDoc.data();
        console.log("user", user);

        // // Here, we assume you have a valid token coming in the headers or query.
        // const token = req.headers.authorization.split('Bearer ')[1]; 
        // const decodedToken = await getAuth().verifyIdToken(token);

        // // Check if the user ID from the token matches the userId from query
        // if (decodedToken.uid !== userId) {
        //     return res.status(403).json({ message: 'Unauthorized access.' });
        // }

        // If the token is valid, respond with the user's information
        res.status(200).json({ message: 'User is authenticated.', token: user.firebaseToken });
    } catch (error) {
        console.error('Error fetching token:', error);
        return res.status(500).json({ message: 'Failed to retrieve token', error: error.message });
    }
});

module.exports = router;
