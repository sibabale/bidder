import { Router } from 'express';
import GetProfileController from '../controllers/profile/fetch';
import UpdateProfileController from '../controllers/profile/update';

const router = Router();
router.get('/get-profile', GetProfileController);
router.put('/update-profile', UpdateProfileController);

export default router;
