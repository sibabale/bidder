// [ CONTROLLERS > AUTH > LOGIN ] ##################################################################

// 1.1. EXTERNAL DEPENDENCIES ......................................................................
import { Request, Response } from 'express';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, query, where, getDocs, updateDoc, collection } from 'firebase/firestore';
// 1.1. END ........................................................................................

// 1.2. INTERNAL DEPENDENCIES ......................................................................
import { auth, db } from '../../../config/firebase';
import { APIError } from '../../../utils/errors';
import { HttpStatusCode } from '../../../types/http_status_codes';
import { isFirebaseError } from '../../../utils/errors/firebase_error';
import { handleFirebaseError } from '../../../utils/error_handler';
import { isValidEmail, isValidPassword } from '../../../utils/validators';
// 1.2. END ........................................................................................

// 1.3. CONTROLLER .................................................................................

const LogInController = async (req: Request, res: Response) => {
    // 1.5.1. FUNCTIONS & LOCAL VARIABLES ............................................................
    const { email, password } = req.body;
    // 1.5.1. END ....................................................................................

    // 1.5.2. CORE LOGIC .............................................................................
    try {
        if (!isValidEmail(email) || !isValidPassword(password)) {
            throw new APIError(
                'ValidationError',
                HttpStatusCode.BAD_REQUEST,
                true,
                'Invalid email or password format'
            );
        }

        interface UserDoc {
            lastName?: string;
            firstName?: string;
            email?: string;
        }

        let userDoc: UserDoc = {};

        const userQuery = query(collection(db, 'users'), where('email', '==', email));
        const querySnapshot = await getDocs(userQuery);
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data && 'email' in data) {
                userDoc = data;
            }
        });

        if (!userDoc) {
            throw new APIError(
                'ValidationError',
                HttpStatusCode.UNAUTHORIZED,
                true,
                'Invalid email or password'
            );
        }

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const firebaseToken = await user.getIdToken();

        if (user.emailVerified && user.uid) {
            await updateDoc(doc(db, 'users', user.uid), {
                emailVerified: true,
            });
        }

        res.status(200).json({
            user: {
                uid: user.uid,
                email: user.email,
                firebaseToken,
                lastName: userDoc.lastName,
                firstName: userDoc.firstName,
                emailVerified: user.emailVerified,
            },
            message: 'Login successful',
        });
    } catch (error) {
        if (error instanceof APIError) {
            res.status(error.httpCode).json({ error: error.message });
        } else if (isFirebaseError(error)) {
            const firebaseError = handleFirebaseError(error);
            console.error('Error logging user:', firebaseError.code, firebaseError.message, error);
            res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: firebaseError.message });
        } else {
            console.error('Unknown Error:', error);
            res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: 'An unknown error occurred' });
        }
    }
    // 1.5.2. END ..................................................................................
};
// 1.5. END ........................................................................................

export default LogInController;
// END FILE ########################################################################################
