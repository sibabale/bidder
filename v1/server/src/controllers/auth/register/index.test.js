// [ CONTROLLERS > AUTH > REGISTER ] ###############################################################
// 1.1. EXTERNAL DEPENDENCIES ......................................................................
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
// 1.1. END ........................................................................................
// 1.2. INTERNAL DEPENDENCIES ......................................................................
import { db, auth } from '../../../config/firebase';
import { APIError } from '@/utils/errors';
import SignUpController from '../../../controllers/auth/register';
import { handleFirebaseError } from '@/utils/error_handler';
// 1.2. END ........................................................................................
// 1.3. FUNCTIONS & LOCAL VARIABLES ...............................................................
jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('@/utils/error_handler');
// 1.3. END ........................................................................................
// 1.4. TEST CASES .................................................................................
describe('SignUpController', () => {
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
    // 1.4.2. RETURNS 400 ON INVALID PASSWORD & EMAIL ................................................
    it('should return 400 if email or password format is invalid', async () => {
        const req = mockRequest({ email: 'invalid-email', password: 'short' });
        const res = mockResponse();
        await expect(SignUpController(req, res)).rejects.toThrow(APIError);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
    // 1.4.2. END ....................................................................................
    // 1.4.3. RETURNS 201 ON SUCCESSFUL SIGNUP .......................................................
    it('should create a new user and save to Firestore', async () => {
        const mockHashedPassword = 'hashedPassword123';
        const mockUserCredential = {
            user: {
                uid: '12345',
                metadata: {
                    creationTime: 'Wed, 21 Aug 2024 16:40:59 GMT',
                },
            },
        };
        createUserWithEmailAndPassword.mockResolvedValue(mockUserCredential);
        setDoc.mockResolvedValue({});
        const req = mockRequest({ email: 'user@example.com', password: 'ValidPass123!' });
        const res = mockResponse();
        await SignUpController(req, res);
        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
            auth,
            'user@example.com',
            'ValidPass123!'
        );
        expect(setDoc).toHaveBeenCalledWith(doc(db, 'users', mockUserCredential.user.uid), {
            uid: '12345',
            email: 'user@example.com',
            creationTime: 'Wed, 21 Aug 2024 16:40:59 GMT',
            emailVerified: undefined,
            lastSignInTime: undefined,
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'User created successfully' });
    });
    // 1.4.3. END ....................................................................................
    // 1.4.4. RETURNS 500 ON SERVER ERROR ...........................................................
    it('should handle errors from Firebase', async () => {
        const mockError = {
            code: 'auth/email-already-in-use',
            message: 'The email address is already in use by another account.',
        };
        createUserWithEmailAndPassword.mockRejectedValue(mockError);
        handleFirebaseError.mockReturnValue(mockError);
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const req = mockRequest({ email: 'user@example.com', password: 'ValidPass123!' });
        const res = mockResponse();
        await SignUpController(req, res);
        expect(handleFirebaseError).toHaveBeenCalledWith(mockError);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'The email address is already in use by another account.',
        });
        consoleSpy.mockRestore();
    });
    // 1.4.4. END ....................................................................................
});
// 1.4. END ........................................................................................
// END FILE ########################################################################################
