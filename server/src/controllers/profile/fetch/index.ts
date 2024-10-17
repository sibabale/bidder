// [ CONTROLLERS > PROFILE > GET PROFILE ] #########################################################

// 1.1. EXTERNAL DEPENDENCIES ......................................................................
import { db } from '../../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { Request, Response } from 'express';
// 1.1. END ........................................................................................

// 1.2. INTERNAL DEPENDENCIES ......................................................................
import { APIError } from '../../../utils/errors';
import { HttpStatusCode } from '../../../types/http_status_codes';
import { handleFirebaseError } from '../../../utils/error_handler';
import { isFirebaseError } from '../../../utils/errors/firebase_error';
// 1.2. END ........................................................................................

// 1.3. DATA .......................................................................................
// 1.3. END ........................................................................................

// 1.4. TYPES ......................................................................................
// 1.4. END ........................................................................................

// 1.5. CONTROLLER .................................................................................

const GetProfileController = async (req: Request, res: Response): Promise<void> => {
    // 1.5.1. FUNCTIONS & LOCAL VARIABLES ..........................................................
    const { userId } = req.query;
    // 1.5.1. END ..................................................................................

    // 1.5.2. CORE LOGIC ...........................................................................

    try {
        const userDocRef = doc(db, 'users', userId as string);

        const profile = (await getDoc(userDocRef)).data();

        if (!profile) {
            throw new APIError(
                'ValidationError',
                HttpStatusCode.NOT_FOUND,
                true,
                'We could not found your profile. Please try again later.',
            );
        }

        res.status(200).json({
            profile,
            message: 'Successful',
        });
    } catch (error) {
        if (error instanceof APIError) {
            res.status(error.httpCode).json({ error: error.message });
        } else if (isFirebaseError(error)) {
            const firebaseError = handleFirebaseError(error);
            console.error('Error fetching profile:', firebaseError.code, firebaseError.message);
            res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: firebaseError.message });
        } else {
            res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: 'An unknown error occurred' });
        }
    }

    // 1.5.2. END ..................................................................................
};

// 1.5. END ........................................................................................
export default GetProfileController;

// END FILE ########################################################################################
