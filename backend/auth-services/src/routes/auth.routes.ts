
import bcrypt from 'bcrypt';
import { User } from '../models/user.model';
import { signJwt, signRefreshJwt, verifyRefreshJwt } from '@smartpet/common';

import express, {Request, Response, NextFunction} from 'express';

const router = express.Router();


type RegisterBody = { email: string; password: string };
type LoginBody    = { email: string; password: string };
type RefreshBody  = { refreshToken: string };



router.post('/register', async (req: Request<{},{}, RegisterBody>, res: Response) => {
  const { email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ email, passwordHash });
    res.json({ id: user._id });
  } catch {
    res.status(400).json({ error: 'Email already exists' });
  }
});

router.post('/login', async (req: Request<{}, {}, LoginBody>, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || typeof user.passwordHash !== 'string') {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const accessToken = signJwt({ sub: user._id.toString(), role: user.role });
  const refreshToken = signRefreshJwt({ sub: user._id.toString() });
  res.json({ accessToken, refreshToken });
});

router.post('/refresh', async (req: Request<{}, {}, RefreshBody>, res: Response) => {
  const { refreshToken } = req.body;

  try {
    const payload = verifyRefreshJwt(refreshToken);
    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const newAccessToken = signJwt({ sub: user._id.toString(), role: user.role });
    res.json({ accessToken: newAccessToken });
  } catch {
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

export default router;