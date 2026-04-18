import { z } from 'zod';

export const createMedicationLogSchema = z.object({
  medicationId: z.string().uuid(),
  taken: z.boolean(),
  takenAt: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export const updateMedicationLogSchema = z
  .object({
    taken: z.boolean().optional(),
    takenAt: z.string().datetime().optional(),
    notes: z.string().optional(),
  })
  .refine((d) => Object.values(d).some((v) => v !== undefined), {
    message: 'At least one field must be provided',
  });
