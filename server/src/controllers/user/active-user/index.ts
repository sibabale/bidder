// [ CONTROLLERS > USER > GET ACTIVE USER ] ########################################################

// 1.1. EXTERNAL DEPENDENCIES ......................................................................
import { getAuth } from 'firebase/auth';
import { Request, Response } from 'express';
// 1.1. END ........................................................................................

// 1.2. INTERNAL DEPENDENCIES ......................................................................
import { APIError } from '../../..//utils/errors';
import { HttpStatusCode } from '../../../types/http_status_codes';
import { handleFirebaseError } from '../../..//utils/error_handler';
import { isFirebaseError } from '../../../utils/errors/firebase_error';
// 1.2. END ........................................................................................

// 1.3. DATA .......................................................................................
// 1.3. END ........................................................................................

// 1.4. TYPES ......................................................................................
// 1.4. END ........................................................................................

// 1.5. CONTROLLER .................................................................................
const GetActiveUserController = async (req: Request, res: Response) => {
    // 1.5.1. FUNCTIONS & LOCAL VARIABLES ............................................................
    // 1.5.1. END ....................................................................................

    // 1.5.2. CORE LOGIC .............................................................................
    try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
            throw new APIError(
                'ValidationError',
                HttpStatusCode.UNAUTHORIZED,
                true,
                'User not authorized'
            );
        }
        res.status(200).json({
            user,
            message: 'Successful',
        });
    } catch (error) {
        if (error instanceof APIError) {
            res.status(error.httpCode).json({ error: error.message });
        } else if (isFirebaseError(error)) {
            const firebaseError = handleFirebaseError(error);
            console.error('Error creating user:', firebaseError.code, firebaseError.message);
            res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: firebaseError.message });
        } else {
            res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: 'An unknown error occurred' });
        }
    }
    // 1.5.2. END ....................................................................................
};
// 1.5. END ........................................................................................
export default GetActiveUserController;
// END FILE ########################################################################################
