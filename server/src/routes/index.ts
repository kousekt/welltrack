import { Express } from 'express';
import authRouter from './auth.routes';

export function registerRoutes(app: Express): void {
  app.use('/api/auth', authRouter);
}
