import { z } from 'zod';

export const createMedicationSchema = z.object({
  name: z.string().min(1),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
});

export const updateMedicationSchema = z
  .object({
    name: z.string().min(1).optional(),
    dosage: z.string().optional(),
    frequency: z.string().optional(),
    isActive: z.boolean().optional(),
  })
  .refine((d) => Object.values(d).some((v) => v !== undefined), {
    message: 'At least one field must be provided',
  });
