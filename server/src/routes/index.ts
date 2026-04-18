import { Express } from 'express';
import authRouter from './auth.routes';
import userRouter from './user.routes';

export function registerRoutes(app: Express): void {
  app.use('/api/auth', authRouter);
  app.use('/api/user', userRouter);
}
