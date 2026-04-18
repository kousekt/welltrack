import express, { Request, Response } from 'express';
import request from 'supertest';
import { ZodError, z } from 'zod';
import { Prisma } from '@prisma/client';
import { errorHandler } from '../../middleware/errorHandler';

function makeApp(thrownError: unknown) {
  const app = express();
  app.get('/test', (_req: Request, _res: Response) => { throw thrownError; });
  app.use(errorHandler);
  return app;
}

describe('errorHandler middleware', () => {
  it('returns 400 with field errors for ZodError', async () => {
    const schema = z.object({ name: z.string() });
    let zodErr: ZodError;
    try { schema.parse({}); } catch (e) { zodErr = e as ZodError; }
    const res = await request(makeApp(zodErr!)).get('/test');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
    expect(res.body.fields).toBeDefined();
  });

  it('returns 404 for Prisma P2025 (record not found)', async () => {
    const err = new Prisma.PrismaClientKnownRequestError('Not found', 'P2025', '3.15.2');
    const res = await request(makeApp(err)).get('/test');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('NOT_FOUND');
  });

  it('returns 409 for Prisma P2002 (unique constraint)', async () => {
    const err = new Prisma.PrismaClientKnownRequestError('Unique constraint', 'P2002', '3.15.2');
    const res = await request(makeApp(err)).get('/test');
    expect(res.status).toBe(409);
    expect(res.body.error).toBe('CONFLICT');
  });

  it('returns 500 for unknown errors', async () => {
    const res = await request(makeApp(new Error('boom'))).get('/test');
    expect(res.status).toBe(500);
  });
});
