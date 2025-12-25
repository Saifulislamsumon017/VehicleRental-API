import { Router } from 'express';
import { authController } from './auth.controller';

const router = Router();

// matches spec exactly:
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

export default router;
