import { Router } from 'express';
import GetActiveUserController from '../controllers/user/active-user';

const router = Router();
router.get('/active-user', GetActiveUserController);
export default router;
