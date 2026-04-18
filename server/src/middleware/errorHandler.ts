import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    res.status(400).json({ error: 'VALIDATION_ERROR', fields: err.flatten().fieldErrors });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'NOT_FOUND' });
      return;
    }
    if (err.code === 'P2002') {
      res.status(409).json({ error: 'CONFLICT' });
      return;
    }
  }

  const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : String(err);
  res.status(500).json({ error: 'INTERNAL_ERROR', message });
}
