import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();
//app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json());

app.use('/auth', authRoutes);

app.get('/health', (_, res) => res.json({ ok: true, service: 'auth-service' }));


import { connectDB } from './db/connect';

(async () => {
  await connectDB();
  // Start daarna je Express-app
  app.listen(3000, () => console.log('Auth service running on http://localhost:3000'));
})();

