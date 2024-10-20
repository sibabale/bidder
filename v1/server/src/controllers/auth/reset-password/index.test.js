// [ CONTROLLERS > AUTH > RESET PASSWORD LINK ] ####################################################
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
// 1.1. END ........................................................................................
// 1.2. INTERNAL DEPENDENCIES ......................................................................
import { handleFirebaseError } from '@/utils/error_handler';
import ResetPasswordController from '../../../controllers/auth/reset-password';
// 1.2. END ........................................................................................
// 1.3. FUNCTIONS & LOCAL VARIABLES ................................................................
jest.mock('firebase/auth');
jest.mock('@/utils/error_handler');
// 1.3. END ........................................................................................
// 1.4. TEST CASES .................................................................................
describe('ResetPasswordController', () => {
    // 1.4.1. BEFORE EACH, AFTER EACH & MOCKS ........................................................
    const mockRequest = (body) => ({ body });
    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    // 1.4.1. END ....................................................................................
    // 1.4.2. RETURNS 200 ON SUCCESS .................................................................
    it('should send a password reset email and return 200', async () => {
        sendPasswordResetEmail.mockResolvedValueOnce(undefined);
        const req = mockRequest({ email: 'user@example.com' });
        const res = mockResponse();
        await ResetPasswordController(req, res);
        expect(sendPasswordResetEmail).toHaveBeenCalledWith(getAuth(), 'user@example.com');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Password reset email sent successfully',
        });
    });
    // 1.4.2. END ....................................................................................
    // 1.4.3. RETURNS 201 ON SUCCESSFUL SIGNUP .......................................................
    it('should handle errors from Firebase', async () => {
        const mockError = { code: 'auth/user-not-found', message: 'User not found.' };
        sendPasswordResetEmail.mockRejectedValueOnce(mockError);
        handleFirebaseError.mockReturnValue(mockError);
        const req = mockRequest({ email: 'user@example.com' });
        const res = mockResponse();
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        await ResetPasswordController(req, res);
        expect(handleFirebaseError).toHaveBeenCalledWith(mockError);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found.' });
        consoleSpy.mockRestore();
    });
    // 1.4.3. END ....................................................................................
    // 1.4.4. RETURNS 400 ON OLD PASSWORD NOT MATCHING  ..............................................
    it('should return 400 if the email is invalid', async () => {
        const req = mockRequest({ email: '' });
        const res = mockResponse();
        await expect(ResetPasswordController(req, res)).rejects.toThrow(
            'Invalid email or password format'
        );
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
    // 1.4.4. END ....................................................................................
});
// 1.4. END ........................................................................................
// END FILE ########################################################################################
