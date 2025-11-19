
import bcrypt from 'bcrypt';
import { User } from '../models/user.model';

import express, {Request, Response, NextFunction} from 'express';
import speakeasy from 'speakeasy';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware } from '../middleware/auth.middleware';
import { signJwt, signRefreshJwt, verifyRefreshJwt, signMfaJwt, verifyMfaJwt } from '../middleware/jwt.middleware';

const router = express.Router();


type RegisterBody = { email: string; password: string };
type LoginBody    = { email: string; password: string };
type MfaVerifyBody = { token: string };
type MfaLoginVerifyBody = { mfaToken: string; token: string };
type RefreshBody  = { refreshToken: string };


router.get('/health', (_, res) => res.json({ ok: true, service: 'auth-service' }));


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

  // If the user has MFA enabled, don't return the final tokens yet.
  if (user.mfaEnabled) {
    // create a short-lived MFA token so frontend can call /mfa/login-verify
    const mfaToken = signMfaJwt({ sub: user._id.toString() });
    return res.json({ mfaRequired: true, mfaToken });
  }

  const accessToken = signJwt({ sub: user._id.toString(), role: user.role });
  const refreshToken = signRefreshJwt({ sub: user._id.toString() });
  res.json({ accessToken, refreshToken });
});

// Start MFA setup: returns otpauth_url and base32 secret. Requires auth.
router.post('/mfa/setup', authMiddleware, async (req: Request, res: Response) => {
  const userId = req.user?.sub;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const secret = speakeasy.generateSecret({ name: `PetCareAI (${user.email})` });
  // Persist temporary secret until user verifies
  user.mfaTempSecret = secret.base32;
  await user.save();

  res.json({ otpauth_url: secret.otpauth_url, base32: secret.base32 });
});

// Verify the TOTP code for setup and enable MFA for the account
router.post('/mfa/verify', authMiddleware, async (req: Request<{}, {}, MfaVerifyBody>, res: Response) => {
  const userId = req.user?.sub;
  const { token } = req.body;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const user = await User.findById(userId);
  if (!user || !user.mfaTempSecret) return res.status(400).json({ error: 'No MFA setup in progress' });

  const verified = speakeasy.totp.verify({ secret: user.mfaTempSecret, encoding: 'base32', token, window: 1 });
  if (!verified) return res.status(400).json({ error: 'Invalid code' });

  // Move temp secret to permanent, enable MFA and generate recovery codes
  user.mfaEnabled = true;
  user.mfaSecret = user.mfaTempSecret;
  user.mfaTempSecret = undefined as any;

  // Generate a small set of recovery codes
  const recoveryCodes: string[] = [];
  for (let i = 0; i < 8; i++) {
    recoveryCodes.push(uuidv4());
  }
  user.mfaRecoveryCodes = recoveryCodes;
  await user.save();

  res.json({ ok: true, recoveryCodes });
});

// Complete login where MFA is required. Accept either a TOTP token or a recovery code.
router.post('/mfa/login-verify', async (req: Request<{}, {}, MfaLoginVerifyBody>, res: Response) => {
  const { mfaToken, token } = req.body;
  try {
    const payload: any = verifyMfaJwt(mfaToken);
    const user = await User.findById(payload.sub);
    if (!user || !user.mfaEnabled || !user.mfaSecret) {
      return res.status(400).json({ error: 'MFA not configured' });
    }

    // Check TOTP first
    const ok = speakeasy.totp.verify({ secret: user.mfaSecret, encoding: 'base32', token, window: 1 });
    let usedRecovery = false;
    if (!ok) {
      // try recovery codes
      const idx = (user.mfaRecoveryCodes || []).indexOf(token);
      if (idx !== -1) {
        usedRecovery = true;
        // remove used recovery code
        user.mfaRecoveryCodes.splice(idx, 1);
        await user.save();
      }
    }

    if (!ok && !usedRecovery) return res.status(401).json({ error: 'Invalid MFA code' });

    // Successful MFA: issue access and refresh tokens
    const accessToken = signJwt({ sub: user._id.toString(), role: user.role });
    const refreshToken = signRefreshJwt({ sub: user._id.toString() });
    return res.json({ accessToken, refreshToken });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired MFA token' });
  }
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