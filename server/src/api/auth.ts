import { Router } from 'express';
import LogInController from '../controllers/auth/login';
import LogOutController from '../controllers/auth/logout';
import RegisterController from '../controllers/auth/register';
import ResetPasswordController from '../controllers/auth/reset-password';

const router = Router();

router.post('/login', LogInController);
router.post('/logout', LogOutController);
router.post('/register', RegisterController);
router.post('/reset-password', ResetPasswordController);

export default router;
