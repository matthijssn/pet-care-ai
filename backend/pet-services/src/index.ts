import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/pet.routes';
import { authMiddleware } from './middleware/auth.middleware';

dotenv.config();

const app = express();

app.use(express.json());

// Protect pet routes with authentication middleware so handlers can safely use `req.user`
app.use('/pets', authMiddleware, authRoutes);

import { connectDB } from './db/connect';

(async () => {
  await connectDB();
  // Start daarna je Express-app
  app.listen(3000, () => console.log('Pet service running on http://localhost:3000'));
})();

