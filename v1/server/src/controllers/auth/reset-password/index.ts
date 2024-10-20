// [ CONTROLLERS > AUTH > RESET PASSWORD ] #########################################################

// 1.1. EXTERNAL DEPENDENCIES ......................................................................
import { Request, Response } from 'express';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
// 1.1. END ........................................................................................

// 1.2. INTERNAL DEPENDENCIES ......................................................................
import { APIError } from '../../../utils/errors';
import { ShopifyGQL } from '../../../config/shopify';
import { isValidEmail } from '../../../utils/validators';
import { HttpStatusCode } from '../../../types/http_status_codes';
import { isFirebaseError } from '../../../utils/errors/firebase_error';
import { handleFirebaseError } from '../../../utils/error_handler';
// 1.2. END ........................................................................................

// 1.3. DATA .......................................................................................
// 1.3. END ........................................................................................

// 1.4. TYPES ......................................................................................
// 1.4. END ........................................................................................

// 1.5. CONTROLLER .................................................................................
const ResetPasswordController = async (req: Request, res: Response) => {
    // 1.5.1. FUNCTIONS & LOCAL VARIABLES ............................................................
    const { email } = req.body;
    // 1.5.1. END ....................................................................................

    // 1.5.2. CORE LOGIC .............................................................................
    if (!isValidEmail(email)) {
        throw new APIError(
            'ValidationError',
            HttpStatusCode.BAD_REQUEST,
            true,
            'Invalid email or password format'
        );
    }

    try {
        const auth = getAuth();

        const customerRecover = `
            mutation customerRecover($email: String!) {
                customerRecover(email: $email) {
                    customerUserErrors {
                        field
                        message
                        code
                    }
                }
            }
        `;

        const shopifyResponse = await ShopifyGQL(customerRecover, {
            email,
        });

        if (!shopifyResponse || !shopifyResponse.data || !shopifyResponse.data.data) {
            throw new APIError(
                'ShopifyError',
                HttpStatusCode.INTERNAL_SERVER,
                true,
                'Failed to get response from Shopify'
            );
        }

        const { customerUserErrors } = shopifyResponse.data.data.customerRecover;

        if (customerUserErrors && customerUserErrors.length > 0) {
            throw new APIError(
                'ShopifyError',
                HttpStatusCode.BAD_REQUEST,
                true,
                customerUserErrors[0].message
            );
        }

        await sendPasswordResetEmail(auth, email);
        res.status(200).json({ message: 'Password reset email sent successfully' });
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
export default ResetPasswordController;
// END FILE ########################################################################################
