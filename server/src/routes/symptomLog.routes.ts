import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../lib/validate';
import { createSymptomLogSchema, updateSymptomLogSchema } from '../schemas/symptomLog.schemas';
import * as symptomLog from '../controllers/symptomLog.controller';

const router = Router();
router.use(authenticate);
router.get('/', symptomLog.getSymptomLogs);
router.post('/', validate(createSymptomLogSchema), symptomLog.createSymptomLog);
router.patch('/:id', validate(updateSymptomLogSchema), symptomLog.updateSymptomLog);
router.delete('/:id', symptomLog.deleteSymptomLog);
export default router;
