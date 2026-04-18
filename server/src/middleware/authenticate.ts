import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../lib/jwt';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'UNAUTHORIZED', message: 'Missing token' });
    return;
  }
  try {
    req.user = verifyAccessToken(authHeader.slice(7));
    next();
  } catch {
    res.status(401).json({ error: 'UNAUTHORIZED', message: 'Invalid or expired token' });
  }
}
