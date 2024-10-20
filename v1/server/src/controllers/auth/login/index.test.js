// [ CONTROLLERS > AUTH > LOGIN ] ##################################################################

// 1.1. EXTERNAL DEPENDENCIES ......................................................................
import { getDocs } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
// 1.1. END ........................................................................................

// 1.2. INTERNAL DEPENDENCIES ......................................................................
import LogInController from '../../../controllers/auth/login/index';
// 1.2. END ........................................................................................

// 1.3. FUNCTIONS & LOCAL VARIABLES ................................................................
jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('@/utils/error_handler');
// 1.3. END ........................................................................................

// 1.4. TEST CASES .................................................................................
describe('LoginController', () => {
    // 1.4.1. BEFORE EACH, AFTER EACH & MOCKS ......................................................
    const mockRequest = (body) => ({ body });
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
    it('should return 200 if user is successfully logged in', async () => {
        const req = mockRequest({
            email: 'user@example.com',
            password: 'correctpassword',
            emailVerified: true,
        });
        const res = mockResponse();
        getDocs.mockResolvedValue({
            forEach: jest.fn((callback) => {
                callback({
                    data: () => ({
                        email: 'user@example.com',
                        password: 'hashedpassword',
                        emailVerified: true,
                    }),
                });
            }),
        });
        signInWithEmailAndPassword.mockResolvedValue({
            user: {
                uid: 'user-uid',
                email: 'user@example.com',
                emailVerified: true,
            },
        });
        await LogInController(req, res);
        expect(res.json).toHaveBeenCalledWith({
            user: {
                uid: 'user-uid',
                email: 'user@example.com',
                emailVerified: true,
            },
            message: 'Login successful',
        });
        expect(res.status).toHaveBeenCalledWith(200);
    });
    // 1.4.2. END ....................................................................................

    // 1.4.2. RETURNS 400 ON INVALID PASSWORD & EMAIL ................................................
    it('should return 400 if email or password format is invalid', async () => {
        const req = mockRequest({ email: 'invalid-email', password: 'short' });
        const res = mockResponse();
        await LogInController(req, res);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email or password format' });
        expect(res.status).toHaveBeenCalledWith(400);
    });
    // 1.4.2. END ....................................................................................

    // 1.4.3. RETURNS 403 IF EMAIL IS NOT VERIFIED ...................................................
    it('should return 403 if the email is not verified', async () => {
        const req = mockRequest({
            email: 'user@example.com',
            password: 'correctpassword',
        });
        const res = mockResponse();
        getDocs.mockResolvedValue({
            forEach: jest.fn((callback) => {
                callback({
                    data: () => ({
                        email: 'user@example.com',
                        password: 'hashedpassword',
                        emailVerified: false,
                    }),
                });
            }),
        });
        signInWithEmailAndPassword.mockResolvedValue({
            user: {
                uid: 'user-uid',
                email: 'user@example.com',
                emailVerified: false,
            },
        });
        await LogInController(req, res);
        expect(res.json).toHaveBeenCalledWith({ error: 'Email is not verified' });
        expect(res.status).toHaveBeenCalledWith(403);
    });
    // 1.4.3. END ....................................................................................
});
// 1.4. END ..........................................................................................

// END FILE ##########################################################################################
