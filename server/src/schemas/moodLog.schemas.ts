import { z } from 'zod';

export const createMoodLogSchema = z.object({
  moodScore: z.number().int().min(1).max(5),
  energyLevel: z.number().int().min(1).max(5).optional(),
  stressLevel: z.number().int().min(1).max(5).optional(),
  notes: z.string().optional(),
  loggedAt: z.string().datetime(),
});

export const updateMoodLogSchema = z
  .object({
    moodScore: z.number().int().min(1).max(5).optional(),
    energyLevel: z.number().int().min(1).max(5).optional(),
    stressLevel: z.number().int().min(1).max(5).optional(),
    notes: z.string().optional(),
    loggedAt: z.string().datetime().optional(),
  })
  .refine((d) => Object.values(d).some((v) => v !== undefined), {
    message: 'At least one field must be provided',
  });
