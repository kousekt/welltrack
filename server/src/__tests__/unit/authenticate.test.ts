import { Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/authenticate';
import * as jwtLib from '../../lib/jwt';

jest.mock('../../lib/jwt');
const mockVerify = jwtLib.verifyAccessToken as jest.Mock;

function makeReq(authHeader?: string): Partial<Request> {
  return { headers: { authorization: authHeader } } as Partial<Request>;
}

function makeRes(): { status: jest.Mock; json: jest.Mock } {
  const res: { status: jest.Mock; json: jest.Mock } = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res;
}

describe('authenticate middleware', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 when Authorization header is missing', () => {
    const req = makeReq(undefined);
    const res = makeRes();
    const next = jest.fn() as NextFunction;
    authenticate(req as Request, res as unknown as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when header does not start with Bearer', () => {
    const req = makeReq('Basic abc123');
    const res = makeRes();
    const next = jest.fn() as NextFunction;
    authenticate(req as Request, res as unknown as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when token verification throws', () => {
    mockVerify.mockImplementation(() => { throw new Error('expired'); });
    const req = makeReq('Bearer bad.token.here');
    const res = makeRes();
    const next = jest.fn() as NextFunction;
    authenticate(req as Request, res as unknown as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('attaches req.user and calls next on valid token', () => {
    const payload = { id: 'user-1', email: 'test@example.com' };
    mockVerify.mockReturnValue(payload);
    const req = makeReq('Bearer valid.token.here') as Request;
    const res = makeRes();
    const next = jest.fn() as NextFunction;
    authenticate(req, res as unknown as Response, next);
    expect(req.user).toEqual(payload);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
