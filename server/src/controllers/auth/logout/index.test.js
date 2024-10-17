// [ CONTROLLERS > AUTH > LOGIN ] ##################################################################
// 1.1. EXTERNAL DEPENDENCIES ......................................................................
import { signOut } from 'firebase/auth';
// 1.1. END ........................................................................................
// 1.2. INTERNAL DEPENDENCIES ......................................................................
import LogOutController from '../../../controllers/auth/logout';
import { handleFirebaseError } from '@/utils/error_handler';
// 1.2. END ........................................................................................
// 1.3. FUNCTIONS & LOCAL VARIABLES ...............................................................
jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(),
    signOut: jest.fn(),
}));
jest.mock('@/utils/error_handler', () => ({
    handleFirebaseError: jest.fn(),
}));
// 1.3. END ........................................................................................
// 1.4. TEST CASES .................................................................................
describe('LogOutController', () => {
    // 1.4.1. BEFORE EACH, AFTER EACH & MOCKS ........................................................
    const mockRequest = () => ({});
    const mockResponse = () => {
        const res = {};
        res.json = jest.fn().mockReturnValue(res);
        res.status = jest.fn().mockReturnValue(res);
        return res;
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    // 1.4.1. END ....................................................................................
    // 1.4.2. RETURNS 200 ON SUCCESSFULL LOGIN .......................................................
    it('should return 200 if logout is successful', async () => {
        const req = mockRequest();
        const res = mockResponse();
        signOut.mockResolvedValue(undefined);
        await LogOutController(req, res);
        expect(signOut).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Logout successful' });
    });
    // 1.4.2. END ....................................................................................
    // 1.4.2. RETURNS 500 ON SERVER ERROR ............................ ...............................
    it('should return 500 if the server fails', async () => {
        const req = mockRequest();
        const res = mockResponse();
        const mockError = { code: 'auth/network-request-failed', message: 'Network error' };
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        signOut.mockRejectedValue(mockError);
        handleFirebaseError.mockReturnValue(mockError);
        await LogOutController(req, res);
        expect(signOut).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(handleFirebaseError).toHaveBeenCalledWith(mockError);
        expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
        consoleSpy.mockRestore();
    });
    // 1.4.2. END ....................................................................................
});
// 1.4. END ........................................................................................
// END FILE ########################################################################################
