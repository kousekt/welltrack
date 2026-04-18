import { z } from 'zod';

export const createHabitSchema = z.object({
  name: z.string().min(1),
  trackingType: z.enum(['boolean', 'numeric', 'duration']),
  unit: z.string().optional(),
});

export const updateHabitSchema = z
  .object({
    name: z.string().min(1).optional(),
    unit: z.string().optional(),
    isActive: z.boolean().optional(),
  })
  .refine((d) => Object.values(d).some((v) => v !== undefined), {
    message: 'At least one field must be provided',
  });
