import { Router } from 'express';
import UserAuth from '../controllers/auth.controller';

const router = Router();

router.post('/signup', UserAuth.signup);
router.post('/signin', UserAuth.signin);

export default router;
