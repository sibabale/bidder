// [ CONTROLLERS > PROFILE > UPDATE PROFILE ] ######################################################

// 1.1. EXTERNAL DEPENDENCIES ......................................................................
import { db } from '../../../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import type { Request, Response } from 'express';
// 1.1. END ........................................................................................

// 1.2. INTERNAL DEPENDENCIES ......................................................................
import { APIError } from '../../../utils/errors';
import { HttpStatusCode } from '../../../types/http_status_codes';
import { handleFirebaseError } from '../../../utils/error_handler';
import { isProfileValid } from '../../../utils/validators';
import { isFirebaseError } from '../../../utils/errors/firebase_error';
// 1.2. END ........................................................................................

// 1.3. DATA .......................................................................................
// 1.3. END ........................................................................................

// 1.4. TYPES ......................................................................................
// 1.4. END ........................................................................................

// 1.5. CONTROLLER .................................................................................

const UpdateProfileController = async (req: Request, res: Response): Promise<void> => {
    // 1.5.1. FUNCTIONS & LOCAL VARIABLES ..........................................................
    const { userId, firstName, lastName, dateOfBirth, phoneNumber, gender, otherGender, selectedGenres } =
        req.body;
    // 1.5.1. END ..................................................................................

    // 1.5.2. CORE LOGIC ...........................................................................

    try {
        if (
            !isProfileValid(
                firstName,
                lastName,
                dateOfBirth,
                phoneNumber,
                gender,
                otherGender,
            )
        ) {
            throw new APIError(
                'ValidationError',
                HttpStatusCode.BAD_REQUEST,
                true,
                'Some of the provided profile details are invalid. Please review your information and try again.',
            );
        }

        const userDocRef = doc(db, 'users', userId);

        await updateDoc(userDocRef, {
            firstName,
            lastName,
            dateOfBirth,
            phoneNumber,
            gender,
            otherGender,
            selectedGenres,
        });

        res.status(200).json({
            message: 'Profle updated successfully',
        });
    } catch (error) {
        if (error instanceof APIError) {
            res.status(error.httpCode).json({ error: error.message });
        } else if (isFirebaseError(error)) {
            const firebaseError = handleFirebaseError(error);
            console.error('Error updating profile:', firebaseError.code, firebaseError.message);
            res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: firebaseError.message });
        } else {
            res.status(HttpStatusCode.INTERNAL_SERVER).json({ error: 'An unknown error occurred' });
        }
    }

    // 1.5.2. END ..................................................................................
};

// 1.5. END ........................................................................................
export default UpdateProfileController;

// END FILE ########################################################################################
