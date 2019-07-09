import { Router } from 'express';
import UserAuth from '../../controllers/auth/index';

const router = Router();

router.post('/', UserAuth.signup);

export default router;
