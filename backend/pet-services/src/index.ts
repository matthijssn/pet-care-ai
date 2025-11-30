

import express, { Request, Response, NextFunction } from 'express';
import petRoutes from './routes/pet.routes';
import { connectDB } from './db/connect';
import { jwtMiddleware } from './middleware/auth.middleware';

const app = express();
app.use(express.json());

connectDB();

// Health check endpoint (no auth)
app.get('/health', (_, res: Response) => {
  res.send({ ok: true, service: 'pet-service', timestamp: new Date() });
});

// JWT middleware for all other routes
app.use(jwtMiddleware);

// Pet routes
app.use('/pets', petRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).send({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Pet service running on port ${PORT}`);
});