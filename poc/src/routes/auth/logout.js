const express = require('express');
const admin = require('../../config/firebase-admin'); // Import your admin auth configuration
const router = express.Router();

// Handle user sign out
router.post('/', async (req, res) => {
    const firebaseToken = req.headers.authorization?.split('Bearer ')[1];
    
    try {
        // Verify the token to ensure the user is authenticated
        const decodedToken = await admin.auth().verifyIdToken(firebaseToken);

        console.log(decodedToken);
        

        // Clear custom claims
        await admin.auth().setCustomUserClaims(decodedToken.uid, null);

        // Return success response
        res.status(200).json({ message: 'Sign out successful' });
    } catch (error) {
        console.error('Error signing out user:', error);
        return res.status(500).json({ message: 'Failed to sign out', error: error.message });
    }
});

module.exports = router;
