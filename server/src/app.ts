import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { registerRoutes } from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

registerRoutes(app);
app.use(errorHandler);

export default app;
