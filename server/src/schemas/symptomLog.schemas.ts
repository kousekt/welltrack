import { z } from 'zod';

export const createSymptomLogSchema = z.object({
  symptomId: z.string().uuid(),
  severity: z.number().int().min(1).max(10),
  notes: z.string().optional(),
  loggedAt: z.string().datetime(),
});

export const updateSymptomLogSchema = z
  .object({
    severity: z.number().int().min(1).max(10).optional(),
    notes: z.string().optional(),
    loggedAt: z.string().datetime().optional(),
  })
  .refine((d) => Object.values(d).some((v) => v !== undefined), {
    message: 'At least one field must be provided',
  });
