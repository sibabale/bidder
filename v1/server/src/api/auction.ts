import { Router } from 'express';
import { createAuction, getAuctionById, getAllAuctions } from '../controllers/auction/index';

const router = Router();

router.get('/fetch', getAllAuctions);
router.post('/create', createAuction);
router.get('/fetch/:id', getAuctionById);

export default router;
