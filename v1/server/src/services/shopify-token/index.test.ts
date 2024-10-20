// [ SERVICES > SIGN IN SHOPIFY ] ##################################################################

// 1.1. EXTERNAL DEPENDENCIES ......................................................................
// 1.1. END ........................................................................................

// 1.2. INTERNAL DEPENDENCIES ......................................................................
import { APIError } from '../../utils/errors';
import { ShopifyGQL } from '../../config/shopify';
import { signInShopifyCustomer } from '.';
import { HttpStatusCode } from '../../types/http_status_codes';

// 1.2. END ........................................................................................

// 1.3. FUNCTIONS & LOCAL VARIABLES ................................................................

jest.mock('../config/shopify', () => ({
    ShopifyGQL: jest.fn(),
}));

// 1.3. END ........................................................................................

// 1.4. TEST CASES .................................................................................
describe('SendVerificationEmail', () => {
    // 1.4.1. BEFORE EACH, AFTER EACH & MOCKS ........................................................

    const email = 'test@example.com';
    const password = 'password123';

    afterEach(() => {
        jest.clearAllMocks();
    });
    // 1.4.1. END ....................................................................................

    // 1.4.2. CAN SUCCESSFULLY VERFIFY EMAIL .........................................................

    it('should return customerAccessToken when sign-in is successful', async () => {
        const mockAccessToken = { accessToken: 'token123', expiresAt: '2025-10-10T00:00:00Z' };

        // Mock successful Shopify response
        (ShopifyGQL as jest.Mock).mockResolvedValue({
            data: {
                data: {
                    customerAccessTokenCreate: {
                        customerAccessToken: mockAccessToken,
                        customerUserErrors: [],
                    },
                },
            },
        });

        const result = await signInShopifyCustomer(email, password);

        // Assert that the correct token is returned
        expect(result).toEqual(mockAccessToken);
        expect(ShopifyGQL).toHaveBeenCalledWith(expect.any(String), { email, password });
    });
    // 1.4.2. CAN SUCCESSFULLY VERFIFY EMAIL .........................................................

    // 1.4.2. CAN SUCCESSFULLY VERFIFY EMAIL .........................................................

    it('should throw an APIError when Shopify returns user errors', async () => {
        const mockErrorMessage = 'Invalid credentials';

        // Mock Shopify response with an error
        (ShopifyGQL as jest.Mock).mockResolvedValue({
            data: {
                data: {
                    customerAccessTokenCreate: {
                        customerAccessToken: null,
                        customerUserErrors: [{ code: 'INVALID', message: mockErrorMessage }],
                    },
                },
            },
        });

        // Assert that the APIError is thrown
        await expect(signInShopifyCustomer(email, password)).rejects.toThrow(APIError);
        await expect(signInShopifyCustomer(email, password)).rejects.toThrow(mockErrorMessage);

        // Ensure the ShopifyGQL is called correctly
        expect(ShopifyGQL).toHaveBeenCalledWith(expect.any(String), { email, password });
    });

    // 1.4.2. END ....................................................................................

    // 1.4.3. HANDLES FAILED EMAIL VERIFICATION ......................................................
    it('should throw an APIError for unexpected errors', async () => {
        // Mock an unexpected error (e.g., network failure)
        (ShopifyGQL as jest.Mock).mockRejectedValue(new Error('Network Error'));

        // Assert that the error is caught and wrapped as an APIError
        await expect(signInShopifyCustomer(email, password)).rejects.toThrow(APIError);
        await expect(signInShopifyCustomer(email, password)).rejects.toThrow(
            'An error occurred during Shopify sign-in'
        );

        // Ensure ShopifyGQL was called
        expect(ShopifyGQL).toHaveBeenCalledWith(expect.any(String), { email, password });
    });

    // 1.4.3. END ....................................................................................
});
// 1.4. END ........................................................................................
// END FILE ########################################################################################
