import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export function connectDB() {
  mongoose.connect(process.env.MONGO_URL!)
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
      console.error('MongoDB connection failed:', err);
      process.exit(1);
    });
}
