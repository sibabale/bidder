import { Router } from 'express';
import UpdateSelectedGenresController from '../controllers/genres/update';

const router = Router();

router.put('/update-selected-genres', UpdateSelectedGenresController);

export default router;