import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Invalid data',
      fields: err.flatten().fieldErrors,
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'NOT_FOUND', message: 'Resource not found' });
      return;
    }
    if (err.code === 'P2002') {
      res.status(409).json({ error: 'CONFLICT', message: 'Resource already exists' });
      return;
    }
  }

  const status = (err as { status?: number }).status ?? 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : String(err);

  res.status(status).json({
    error: (err as { code?: string }).code ?? 'INTERNAL_ERROR',
    message,
  });
}
