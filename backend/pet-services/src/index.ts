import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/pet.routes';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/pets', authRoutes);

import { connectDB } from './db/connect';

(async () => {
  await connectDB();
  // Start daarna je Express-app
  app.listen(3000, () => console.log('Auth service running on http://localhost:3000'));
})();

