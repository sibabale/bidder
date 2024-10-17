// [ CONTROLLERS > AUTH > LOGOUT ] #################################################################

// 1.1. EXTERNAL DEPENDENCIES ......................................................................
import { signOut } from 'firebase/auth';
import { Request, Response } from 'express';
// 1.1. END ........................................................................................

// 1.2. INTERNAL DEPENDENCIES ......................................................................
import { auth } from '../../../config/firebase';
import { APIError } from '../../../utils/errors';
import { HttpStatusCode } from '../../../types/http_status_codes';
import { isFirebaseError } from '../../../utils/errors/firebase_error';
import { handleFirebaseError } from '../../../utils/error_handler';
// 1.2. END ........................................................................................

// 1.3. DATA .......................................................................................
// 1.3. END ........................................................................................

// 1.4. TYPES ......................................................................................
// 1.4. END ........................................................................................

// 1.5. CONTROLLER .................................................................................
const LogOutController = async (req: Request, res: Response) => {
    // 1.5.1. FUNCTIONS & LOCAL VARIABLES ............................................................
    // 1.5.1. END ....................................................................................

    // 1.5.2. CORE LOGIC .............................................................................
    try {
        await signOut(auth);
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        if (error instanceof APIError) {
            res.status(error.httpCode).json({ error: error.message });
        } else if (isFirebaseError(error)) {
            const firebaseError = handleFirebaseError(error);
            console.error('Error logging out:', firebaseError.code, firebaseError.message);
            res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: firebaseError.message });
        } else {
            res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: 'An unknown error occurred' });
        }
    }
    // 1.5.2. END ....................................................................................
};

// 1.5. END ........................................................................................
export default LogOutController;
// END FILE ########################################################################################
