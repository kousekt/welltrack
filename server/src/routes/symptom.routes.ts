import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../lib/validate';
import { createSymptomSchema, updateSymptomSchema } from '../schemas/symptom.schemas';
import * as symptom from '../controllers/symptom.controller';

const router = Router();
router.use(authenticate);
router.get('/', symptom.getSymptoms);
router.post('/', validate(createSymptomSchema), symptom.createSymptom);
router.patch('/:id', validate(updateSymptomSchema), symptom.updateSymptom);
router.delete('/:id', symptom.deleteSymptom);
export default router;
