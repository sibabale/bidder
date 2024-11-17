require('dotenv').config();
const express = require('express');
const { rateLimit } = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { collection, query, where, getDocs } = require('firebase/firestore');
const db = require('../../../firebase-config');

const router = express.Router();

const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 registrations per windowMs
    message: 'Too many registrations from this IP, please try again later.',
});

const isValidPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
};

router.post('/', registerLimiter, [
    body('email').isEmail().withMessage('Please provide a valid email address.'),
    body('firstName').notEmpty().withMessage('First name is required.'),
    body('lastName').notEmpty().withMessage('Last name is required.'),
    body('password').custom(value => {
        if (!isValidPassword(value)) {
            throw new Error('Password does not meet security requirements.');
        }
        return true;
    }),
], async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const sanitizedErrors = errors.array().map(error => ({
            field: error.path,
            message: error.path === 'password' 
                ? 'Password must contain at least 8 characters, including uppercase, lowercase, and numbers.' 
                : error.msg
        }));

        return res.status(400).json({ 
            message: 'Validation failed',
            errors: sanitizedErrors
        });
    }

    const { email } = req.body;

    try {
        const usersQuery = query(
            collection(db, 'users'), 
            where('email', '==', email)
        );
        
        const querySnapshot = await getDocs(usersQuery);
        
        if (!querySnapshot.empty) {
            return res.status(400).json({ 
                message: 'An account with this email already exists'
            });
        }

        res.status(200).json({ 
            message: 'Pre-registration verification successful',
            verified: true
        });
    } catch (error) {
        console.error('Error during pre-registration verification:', error);
        res.status(500).json({ 
            message: 'Verification failed',
            error: 'An error occurred during verification'
        });
    }
});

module.exports = router;
