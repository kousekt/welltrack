import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate } from '../../lib/validate';

const schema = z.object({ name: z.string().min(1), age: z.number().int() });

function makeReq(body: unknown): Partial<Request> {
  return { body } as Partial<Request>;
}

function makeRes() {
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
  return res;
}

describe('validate middleware factory', () => {
  it('calls next and sets req.body to parsed data on valid input', () => {
    const req = makeReq({ name: 'Alice', age: 30 });
    const res = makeRes();
    const next = jest.fn() as NextFunction;
    validate(schema)(req as Request, res as unknown as Response, next);
    expect(next).toHaveBeenCalled();
    expect((req as Request).body).toEqual({ name: 'Alice', age: 30 });
  });

  it('returns 400 with VALIDATION_ERROR on invalid input', () => {
    const req = makeReq({ name: '', age: 'not-a-number' });
    const res = makeRes();
    const next = jest.fn() as NextFunction;
    validate(schema)(req as Request, res as unknown as Response, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'VALIDATION_ERROR', fields: expect.any(Object) })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 400 when required fields are missing', () => {
    const req = makeReq({});
    const res = makeRes();
    const next = jest.fn() as NextFunction;
    validate(schema)(req as Request, res as unknown as Response, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });
});
