const express = require('express');

const admin = require('../../config/firebase-admin'); 
const router = express.Router();

router.post('/', async (req, res) => {
    
    const firebaseToken = req.headers.authorization?.split('Bearer ')[1];
    
    try {
        // Verify the token to ensure the user is authenticated
        const decodedToken = await admin.auth().verifyIdToken(firebaseToken);

        // Revoke refresh tokens to log out the user from all sessions
        await admin.auth().revokeRefreshTokens(decodedToken.uid);

        res.status(200).json({ message: 'Sign out successful' });
    } catch (error) {
        console.error('Error signing out user:', error);
        return res.status(500).json({ message: 'Failed to sign out', error: error.message });
    }
});

module.exports = router;
