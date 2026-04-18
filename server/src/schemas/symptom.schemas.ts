import { z } from 'zod';

export const createSymptomSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
});

export const updateSymptomSchema = z
  .object({
    name: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((d) => Object.values(d).some((v) => v !== undefined), {
    message: 'At least one field must be provided',
  });
