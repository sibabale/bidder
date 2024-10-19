const express = require('express');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const admin = require('../../config/firebase-admin'); // Import admin auth
const { validationResult, body } = require('express-validator');
const router = express.Router();

// Handle user login
router.post('/', [
    body('email').isEmail().withMessage('Please provide a valid email address.'),
    body('password').notEmpty().withMessage('Password is required.'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const firebaseToken = await user.getIdToken();

        // Fetch the user's custom claims using the Admin SDK
        const userRecord = await admin.auth().getUser(user.uid);
        const customClaims = userRecord.customClaims || {};

        // Check for already logged in users (you may implement a mechanism to track active sessions if needed)
        // This is just a sample condition; replace with your actual logic for tracking sessions
        if (customClaims.isLoggedIn) {
            return res.status(403).json({ message: 'User is already logged in from another device.' });
        }

        // If everything is fine, set custom claims if needed
        const response = await fetch(`${req.protocol}://${req.get('host')}/api/set-custom-claims`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${firebaseToken}`,
            },
            body: JSON.stringify({ uid: user.uid }),
        });

        if (!response.ok) {
            throw new Error('Failed to set custom claims.');
        }

        // Return success response
        res.status(200).json({ message: 'Login successful', userId: user.uid, firebaseToken });

    } catch (error) {
        console.error('Error logging in user:', error);
        if (error.code === 'auth/wrong-password') {
            return res.status(401).json({ message: 'Invalid password. Please try again.' });
        } else if (error.code === 'auth/user-not-found') {
            return res.status(404).json({ message: 'No user found with this email.' });
        } else {
            return res.status(500).json({ message: 'Failed to log in user', error: error.message });
        }
    }
});

module.exports = router;
