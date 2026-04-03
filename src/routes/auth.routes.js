import { Router } from 'express';
import { authLimiter } from '../config/rateLimiter.js';
import * as authController from '../controllers/auth.controller.js';
import { signupSchema, loginSchema } from '../validators/auth.validator.js';
import validate from '../middlewares/validate.js';

const router = Router();

router.post('/login', authLimiter, validate(loginSchema), authController.login);

router.post(
  '/signup',
  authLimiter,
  validate(signupSchema),
  authController.signup,
);

export default router;
