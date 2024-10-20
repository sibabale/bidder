// [ SERVICES > SIGN IN SHOPIFY ] ##################################################################

// 1.1. EXTERNAL DEPENDENCIES ......................................................................
import { ShopifyGQL } from '../../config/shopify';
import { APIError } from '../../utils/errors';
import { HttpStatusCode } from '../../types/http_status_codes';

// 1.1. END ........................................................................................

// 1.2. INTERNAL DEPENDENCIES ......................................................................
// 1.2. END ........................................................................................

// 1.3. DATA .......................................................................................
// 1.3. END ........................................................................................

// 1.4. TYPES ......................................................................................
// 1.4. END ........................................................................................

// 1.5. EMAIL VERIFICATION FUNCTION ................................................................
export const signInShopifyCustomer = async (email: string, password: string) => {
    // 1.5.1. FUNCTIONS & LOCAL VARIABLES ..........................................................
    // 1.5.1. END ..................................................................................

    // 1.5.2. CORE LOGIC ...........................................................................

    try {
        const signInWithEmailAndPasswordMutation = `
            mutation SignInWithEmailAndPassword($email: String!, $password: String!) {
                customerAccessTokenCreate(input: { 
                    email: $email, 
                    password: $password
                }) {
                    customerAccessToken {
                        accessToken
                        expiresAt
                    }
                    customerUserErrors {
                        code
                        message
                    }
                }
            }
        `;

        const shopifyResponse = await ShopifyGQL(signInWithEmailAndPasswordMutation, {
            email,
            password,
        });

        const { customerAccessToken, customerUserErrors } =
            shopifyResponse.data.data.customerAccessTokenCreate;

        if (customerUserErrors.length > 0) {
            console.error('Shopify Error:', customerUserErrors[0].message);
            throw new APIError(
                'ShopifyError',
                HttpStatusCode.UNAUTHORIZED,
                true,
                customerUserErrors[0].message
            );
        }

        return customerAccessToken;
    } catch (error) {
        console.error('Error during Shopify sign-in:', error);
        throw new APIError(
            'ShopifySignInError',
            HttpStatusCode.INTERNAL_SERVER,
            true,
            'An error occurred during Shopify sign-in'
        );
    }
    // 1.5.2. END ..................................................................................
};
// 1.5. END ........................................................................................

// END FILE ########################################################################################
