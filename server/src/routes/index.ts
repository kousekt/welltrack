import { Express } from 'express';
import authRouter from './auth.routes';
import userRouter from './user.routes';
import symptomRouter from './symptom.routes';
import symptomLogRouter from './symptomLog.routes';
import moodLogRouter from './moodLog.routes';
import medicationRouter from './medication.routes';
import medicationLogRouter from './medicationLog.routes';
import habitRouter from './habit.routes';
import habitLogRouter from './habitLog.routes';

export function registerRoutes(app: Express): void {
  app.use('/api/auth', authRouter);
  app.use('/api/users', userRouter);
  app.use('/api/symptoms', symptomRouter);
  app.use('/api/symptom-logs', symptomLogRouter);
  app.use('/api/mood-logs', moodLogRouter);
  app.use('/api/medications', medicationRouter);
  app.use('/api/medication-logs', medicationLogRouter);
  app.use('/api/habits', habitRouter);
  app.use('/api/habit-logs', habitLogRouter);
}
