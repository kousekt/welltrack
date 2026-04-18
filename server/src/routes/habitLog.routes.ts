import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../lib/validate';
import { createHabitLogSchema, updateHabitLogSchema } from '../schemas/habitLog.schemas';
import * as habitLog from '../controllers/habitLog.controller';

const router = Router();
router.use(authenticate);
router.get('/', habitLog.getHabitLogs);
router.post('/', validate(createHabitLogSchema), habitLog.createHabitLog);
router.patch('/:id', validate(updateHabitLogSchema), habitLog.updateHabitLog);
router.delete('/:id', habitLog.deleteHabitLog);
export default router;
