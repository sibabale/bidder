
const express = require('express');
const { doc, getDoc } = require('firebase/firestore');
const db = require('../../../firebase-config');

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
        res.status(200).json({ message: 'User is authenticated.', token: user.jwtToken });
    } catch (error) {
        console.error('Error fetching token:', error);
        return res.status(500).json({ message: 'Failed to retrieve token', error: error.message });
    }
});

module.exports = router;
