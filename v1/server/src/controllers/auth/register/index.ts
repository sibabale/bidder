// [ CONTROLLERS > AUTH > REGISTER ] ###############################################################

// 1.1. EXTERNAL DEPENDENCIES ......................................................................
import axios from 'axios';
import dotenv from 'dotenv';
import { doc, setDoc } from 'firebase/firestore';
import { Request, Response } from 'express';
import { createUserWithEmailAndPassword } from 'firebase/auth';
// 1.1. END ........................................................................................

// 1.2. INTERNAL DEPENDENCIES ......................................................................
import { auth, db } from '../../../config/firebase';
import { APIError } from '../../../utils/errors';
import { HttpStatusCode } from '../../../types/http_status_codes';
import { isFirebaseError } from '../../../utils/errors/firebase_error';
import { handleFirebaseError } from '../../../utils/error_handler';
import { sendVerificationEmail } from '../../../services/verify-email';
import { isValidEmail, isValidPassword } from '../../../utils/validators';
// 1.2. END ........................................................................................

// 1.3. DATA .......................................................................................
// 1.3. END ........................................................................................

// 1.4. TYPES ......................................................................................
// 1.4. END ........................................................................................

// 1.5. CONTROLLER .................................................................................
const RegisterController = async (req: Request, res: Response) => {
    // 1.5.1. FUNCTIONS & LOCAL VARIABLES ..........................................................
    dotenv.config();

    const { email, password, firstName, lastName } = req.body;

    // 1.5.1. END ..................................................................................

    // 1.5.2. CORE LOGIC ...........................................................................

    if (!isValidEmail(email) || !isValidPassword(password) || !firstName || !lastName) {
        throw new APIError(
            'ValidationError',
            HttpStatusCode.BAD_REQUEST,
            true,
            'Invalid email, password, first name or last name format.'
        );
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const firebaseToken = await user.getIdToken();
        if (!user.uid) {
            throw new APIError(
                'UserCreationError',
                HttpStatusCode.NOT_FOUND,
                true,
                'User ID is not available'
            );
        }

        await sendVerificationEmail(user);
        const { uid, metadata, emailVerified } = user;
        const { creationTime, lastSignInTime } = metadata;

        await setDoc(doc(db, 'users', uid), {
            uid,
            email,
            lastName,
            firstName,
            creationTime,
            emailVerified,
            lastSignInTime,
        });

        res.status(HttpStatusCode.CREATED).json({
            user: {
                uid: user.uid,
                email: user.email,
                firebaseToken,
                emailVerified: user.emailVerified,
            },
            message: 'User created successfully in Firebase and Shopify',
        });
    } catch (error) {
        if (error instanceof APIError) {
            res.status(error.httpCode).json({ error: error.message });
        } else if (isFirebaseError(error)) {
            const firebaseError = handleFirebaseError(error);
            const statusCode = firebaseError.status || HttpStatusCode.INTERNAL_SERVER;
            console.error('Error creating user:', firebaseError.code, firebaseError.message, error);
            res.status(statusCode).json({ error: firebaseError.message });
        } else if (axios.isAxiosError(error)) {
            console.error('Error creating Shopify account:', error.response?.data);
            res.status(HttpStatusCode.INTERNAL_SERVER).json({
                error: 'Shopify account creation failed',
            });
        } else {
            console.error(error);
            res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: 'An unknown error occurred' });
        }
    }
    // 1.5.2. END ..................................................................................
};
// 1.5. END ........................................................................................
export default RegisterController;
// END FILE ########################################################################################
