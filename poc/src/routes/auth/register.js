const admin = require('firebase-admin');
const express = require('express');
const rateLimit = require('express-rate-limit');
const { doc, setDoc } = require('firebase/firestore');
const { body, validationResult } = require('express-validator');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');

const db = require('../../../firebase-config');
const router = express.Router();
const verifyToken = require('../../middleware/auth/verifyToken');

const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 registrations per windowMs
    message: 'Too many registrations from this IP, please try again later.',
});

const isValidPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
};

router.post('/', registerLimiter, verifyToken, [
    body('email').isEmail().withMessage('Please provide a valid email address.'),
    body('firstName').notEmpty().withMessage('First name is required.'),
    body('lastName').notEmpty().withMessage('Last name is required.'),
    body('password').custom(value => {
        if (!isValidPassword(value)) {
            throw new Error('Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, and a number.');
        }
        return true;
    }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName } = req.body;

    try {
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        const user = userCredential.user;

        if (!user.uid) {
            throw new Error('User ID is not available');
        }

        // Fetch the user's custom claims using the Admin SDK
        const userRecord = await admin.auth().getUser(user.uid);
        const customClaims = userRecord.customClaims || {};

        // Check for already logged in users (you may implement a mechanism to track active sessions if needed)
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

        const { uid, metadata } = user;
        const { creationTime, lastSignInTime } = metadata;

        await setDoc(doc(db, 'users', uid), {
            uid,
            bids: [],
            email,
            lastName,
            products: [],
            firstName,
            creationTime,
            emailVerified: false,
            lastSignInTime,
        });

        res.status(201).json({ message: 'User registered successfully', userId: uid });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Failed to register user', error: error.message });
    }
});

module.exports = router;
