import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { signJwt, signRefreshJwt, verifyJwt, verifyRefreshJwt } from '@smartpet/common';


import cors from 'cors';



dotenv.config();

function authMiddleware(req : any, res : any, next : any) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).send({ error: 'Missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyJwt(token);
    req.user = payload;
    next();
  } catch {
    res.status(401).send({ error: 'Invalid token' });
  }
}


const app = express();
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));

app.use(express.json());

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ email, passwordHash });
    res.send({ id: user._id });
  } catch {
    res.status(400).send({ error: 'Email already exists' });
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || typeof user.passwordHash !== 'string') {
    return res.status(401).send({ error: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).send({ error: 'Invalid credentials' });
  }

  const accessToken = signJwt({ sub: user._id.toString(), role: user.role });
  const refreshToken = signRefreshJwt({ sub: user._id.toString() });
  res.send({ accessToken, refreshToken });
});



app.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const payload = verifyRefreshJwt(refreshToken);
    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).send({ error: 'Invalid refresh token' });
    }

    const newAccessToken = signJwt({ sub: user._id.toString(), role: user.role });
    res.send({ accessToken: newAccessToken });
  } catch {
    res.status(401).send({ error: 'Invalid or expired refresh token' });
  }
});
``


app.get('/health', (_, res) => res.send({ ok: true, service: 'auth-service' }));

app.listen(3000, () => console.log('Auth service running'));



mongoose.connect(process.env.MONGO_URL!);

const User = mongoose.model('User', new mongoose.Schema({
  email: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ['owner', 'admin'], default: 'owner' }
}));


