import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.JWT_SECRET || 'default_secret';
const refreshSecret = process.env.JWT_REFRESH_SECRET || 'default_refresh_secret';

export function signJwt(payload: object): string {
  return jwt.sign(payload, secret, { expiresIn: '6h' });
}


export function signRefreshJwt(payload: object): string {
  return jwt.sign(payload, refreshSecret, { expiresIn: '7d' });
}

export function verifyJwt(token: string): any {
  return jwt.verify(token, secret);
}

export function verifyRefreshJwt(token: string): any {
  return jwt.verify(token, refreshSecret);
}
