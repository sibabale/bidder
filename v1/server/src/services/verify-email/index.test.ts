// [ CONTROLLERS > AUTH > VERIFY EMAIL ] ###########################################################

// 1.1. EXTERNAL DEPENDENCIES ......................................................................
import { sendEmailVerification } from 'firebase/auth';
// 1.1. END ........................................................................................

// 1.2. INTERNAL DEPENDENCIES ......................................................................
import { sendVerificationEmail } from '.';
// 1.2. END ........................................................................................

// 1.3. FUNCTIONS & LOCAL VARIABLES ................................................................

jest.mock('firebase/auth', () => ({
    sendEmailVerification: jest.fn(),
}));

// 1.3. END ........................................................................................

// 1.4. TEST CASES .................................................................................
describe('SendVerificationEmail', () => {
    // 1.4.1. BEFORE EACH, AFTER EACH & MOCKS ........................................................

    beforeEach(() => {
        jest.clearAllMocks();
    });
    // 1.4.1. END ....................................................................................

    // 1.4.2. CAN SUCCESSFULLY VERFIFY EMAIL .........................................................

    it('should send verification email successfully', async () => {
        const mockUser = { email: 'test@example.com' } as any;
        (sendEmailVerification as jest.Mock).mockResolvedValueOnce(undefined);

        await sendVerificationEmail(mockUser);

        expect(sendEmailVerification).toHaveBeenCalledWith(mockUser);
        expect(sendEmailVerification).toHaveBeenCalledTimes(1);
    });

    // 1.4.2. END ....................................................................................

    // 1.4.3. HANDLES FAILED EMAIL VERIFICATION ......................................................
    it('should handle errors when sending verification email fails', async () => {
        const error = new Error('Network Error');
        const mockUser = { email: 'test@example.com' } as any;
        (sendEmailVerification as jest.Mock).mockRejectedValueOnce(error);

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        await expect(sendVerificationEmail(mockUser)).rejects.toThrow(
            'Failed to send verification email.'
        );
        expect(sendEmailVerification).toHaveBeenCalledWith(mockUser);
        expect(sendEmailVerification).toHaveBeenCalledTimes(1);
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error sending verification email:', error);

        consoleErrorSpy.mockRestore();
    });

    // 1.4.3. END ....................................................................................
});
// 1.4. END ........................................................................................
// END FILE ########################################################################################
