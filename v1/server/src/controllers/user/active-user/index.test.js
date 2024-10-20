// [ CONTROLLERS > USER > GET ACTIVE USER ] ########################################################
import { getAuth } from 'firebase/auth';
// 1.1. END ........................................................................................
// 1.2. INTERNAL DEPENDENCIES ......................................................................
import GetActiveUserController from '../../../controllers/user/activeUserController/index';
// 1.2. END ........................................................................................
// 1.3. FUNCTIONS & LOCAL VARIABLES ...............................................................
jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('@/utils/error_handler');
// 1.3. END ........................................................................................
// 1.4. TEST CASES .................................................................................
describe('GetActiveUserController', () => {
    // 1.4.1. BEFORE EACH, AFTER EACH & MOCKS ........................................................
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
    // 1.4.2. RETURNS 200 ON SUCCESS .................................................................
    it('should return 200 if there is a active user', async () => {
        const req = mockRequest({});
        const res = mockResponse();
        getAuth.mockResolvedValue({
            Auth: {
                currentUser: {
                    uid: 'user-uid',
                    signInWithEmailLink: 'user@example.com',
                    emailVerified: true,
                },
            },
        });
        await GetActiveUserController(req, res);
        expect(res.json).toHaveBeenCalledWith({
            user: {
                uid: 'user-uid',
                email: 'user@example.com',
                emailVerified: true,
            },
            message: 'Successful',
        });
        expect(res.status).toHaveBeenCalledWith(200);
    });
    // 1.4.2. END ....................................................................................
    // 1.4.2. RETURNS 401 ON Unauthorized User .......................................................
    it('should return 401 if user is not logged in', async () => {
        const req = mockRequest({});
        const res = mockResponse();
        await GetActiveUserController(req, res);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not authorized' });
        expect(res.status).toHaveBeenCalledWith(401);
    });
    // 1.4.2. END ....................................................................................
});
// 1.4. END ........................................................................................
// END FILE ########################################################################################
