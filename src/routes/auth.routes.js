import { Router } from 'express';
import { authLimiter } from '../config/rateLimiter.js';
import * as authController from '../controllers/auth.controller.js';

const router = Router();

router.post('/login', authLimiter, authController.login);

router.post('/signup', authLimiter, authController.signup);

export default router;
