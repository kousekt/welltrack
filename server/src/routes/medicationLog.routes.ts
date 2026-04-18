import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../lib/validate';
import { createMedicationLogSchema, updateMedicationLogSchema } from '../schemas/medicationLog.schemas';
import * as medicationLog from '../controllers/medicationLog.controller';

const router = Router();
router.use(authenticate);
router.get('/', medicationLog.getMedicationLogs);
router.post('/', validate(createMedicationLogSchema), medicationLog.createMedicationLog);
router.patch('/:id', validate(updateMedicationLogSchema), medicationLog.updateMedicationLog);
router.delete('/:id', medicationLog.deleteMedicationLog);
export default router;
