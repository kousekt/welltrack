import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../lib/validate';
import { updateUserSchema } from '../schemas/user.schemas';
import * as user from '../controllers/user.controller';

const router = Router();

router.use(authenticate);
router.get('/me', user.getMe);
router.patch('/me', validate(updateUserSchema), user.updateMe);
router.delete('/me', user.deleteMe);

export default router;
