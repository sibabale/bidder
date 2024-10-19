// src/routes/auth/login.js
const express = require('express');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
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
