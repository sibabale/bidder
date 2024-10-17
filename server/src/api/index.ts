import express from 'express';

import auth from './auth';
import user from './user';
import auction from './auction';
import profile from './profile';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'API - 👋🌎🌍🌏',
    });
});

router.use('/auth', auth);
router.use('/user', user);
router.use('/profile', profile);
router.use('/auctions', auction);

export default router;
