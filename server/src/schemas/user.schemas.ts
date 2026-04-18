import { z } from 'zod';

export const updateUserSchema = z
  .object({
    displayName: z.string().min(1).optional(),
    timezone: z.string().optional(),
  })
  .refine((d) => d.displayName !== undefined || d.timezone !== undefined, {
    message: 'At least one field must be provided',
  });
