import { z } from 'zod';

export const createHabitLogSchema = z.object({
  habitId: z.string().uuid(),
  valueBoolean: z.boolean().optional(),
  valueNumeric: z.number().optional(),
  valueDuration: z.number().int().optional(),
  notes: z.string().optional(),
  loggedAt: z.string().datetime(),
});

export const updateHabitLogSchema = z
  .object({
    valueBoolean: z.boolean().optional(),
    valueNumeric: z.number().optional(),
    valueDuration: z.number().int().optional(),
    notes: z.string().optional(),
    loggedAt: z.string().datetime().optional(),
  })
  .refine((d) => Object.values(d).some((v) => v !== undefined), {
    message: 'At least one field must be provided',
  });
