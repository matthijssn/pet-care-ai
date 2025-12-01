import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/pet.routes';
import { authMiddleware } from './middleware/auth.middleware';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());


// Protect pet routes with authentication middleware so handlers can safely use `req.user`
app.use('/pets', authMiddleware, authRoutes);

import { connectDB } from './db/connect';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Pet service running on http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start pet service:', error);
    process.exit(1);
  }
})();

