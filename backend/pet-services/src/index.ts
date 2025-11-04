import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { verifyJwt } from '@smartpet/common';

const app = express();
app.use(express.json());

dotenv.config();
mongoose.connect(process.env.MONGO_URL!);

const Pet = mongoose.model('Pet', new mongoose.Schema({
  ownerId: String,
  name: String,
  species: { type: String, enum: ['dog', 'cat', 'bird', 'fish', 'reptile', 'other'] },
  breed: String,
  birthDate: String,
  weightKg: Number
}));


app.get('/health', (_, res) => {
  res.send({ ok: true, service: 'pet-service' });
});

app.listen(3000, () => {
  console.log('Pet service running on port 3000');
});

app.use((req : any, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('Missing token');
    req.user = verifyJwt(token);
    next();
  } catch {
    res.status(401).send({ error: 'Unauthorized' });
  }
});

app.get('/', async (req : any, res) => {
  const pets = await Pet.find({ ownerId: req.user.sub });
  res.send(pets);
});