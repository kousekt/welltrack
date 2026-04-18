import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../lib/validate';
import { createHabitSchema, updateHabitSchema } from '../schemas/habit.schemas';
import * as habit from '../controllers/habit.controller';

const router = Router();
router.use(authenticate);
router.get('/', habit.getHabits);
router.post('/', validate(createHabitSchema), habit.createHabit);
router.patch('/:id', validate(updateHabitSchema), habit.updateHabit);
router.delete('/:id', habit.deleteHabit);
export default router;
