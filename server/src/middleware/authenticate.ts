import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../lib/jwt';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'UNAUTHORIZED' });
    return;
  }
  try {
    req.user = verifyAccessToken(auth.slice(7));
    next();
  } catch {
    res.status(401).json({ error: 'UNAUTHORIZED' });
  }
}
