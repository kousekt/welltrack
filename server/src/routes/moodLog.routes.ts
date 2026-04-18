import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../lib/validate';
import { createMoodLogSchema, updateMoodLogSchema } from '../schemas/moodLog.schemas';
import * as moodLog from '../controllers/moodLog.controller';

const router = Router();
router.use(authenticate);
router.get('/', moodLog.getMoodLogs);
router.post('/', validate(createMoodLogSchema), moodLog.createMoodLog);
router.patch('/:id', validate(updateMoodLogSchema), moodLog.updateMoodLog);
router.delete('/:id', moodLog.deleteMoodLog);
export default router;
