require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const { doc, getDoc} = require('firebase/firestore');
const { validationResult, body } = require('express-validator');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

const db = require('../../../firebase-config');
const router = express.Router();

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

        const userDocRef = doc(db, 'users', user.uid); 
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            return res.status(404).json({ message: 'User not found in the database.' });
        }

        const jwtToken = jwt.sign(
            { uid: user.uid, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const userData = userDoc.data();

        res.status(200).json({ message: 'Login successful', user: {
            email: userData.email,
            userId: user.uid,
            firstName: userData.firstName,
            lastName: userData.lastName,
        }, jwtToken });

    } catch (error) {
        console.error('Error logging in user:', error);
        if (error.code === 'auth/wrong-password') {
            return res.status(401).json({ message: 'Invalid password. Please try again.' });
        } else if (error.code === 'auth/user-not-found') {
            return res.status(404).json({ message: 'No user found with this email.' });
        } else if (error.code === 'auth/invalid-credential') {
            return res.status(404).json({ message: 'Invalid email or password.' });
        } else {
            return res.status(500).json({ message: 'Failed to log in user', error: error.message });
        }
    }
});

module.exports = router;
