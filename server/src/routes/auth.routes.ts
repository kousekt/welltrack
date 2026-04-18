import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../lib/validate';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  logoutSchema,
} from '../schemas/auth.schemas';
import * as auth from '../controllers/auth.controller';

const router = Router();

router.post('/register', validate(registerSchema), auth.register);
router.post('/login', validate(loginSchema), auth.login);
router.post('/refresh', auth.refresh);
router.post('/logout', authenticate, validate(logoutSchema), auth.logout);
router.post('/forgot-password', validate(forgotPasswordSchema), auth.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), auth.resetPassword);

export default router;
