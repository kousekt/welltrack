import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../lib/validate';
import { createMedicationSchema, updateMedicationSchema } from '../schemas/medication.schemas';
import * as medication from '../controllers/medication.controller';

const router = Router();
router.use(authenticate);
router.get('/', medication.getMedications);
router.post('/', validate(createMedicationSchema), medication.createMedication);
router.patch('/:id', validate(updateMedicationSchema), medication.updateMedication);
router.delete('/:id', medication.deleteMedication);
export default router;
