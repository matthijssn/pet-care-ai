import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '@smartpet/common';

export function jwtMiddleware(req: any, res: Response, next: NextFunction) {
  if (req.path === '/health' && req.method === 'GET') {
    return next();
  }
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('Missing token');
    req.user = verifyJwt(token);
    next();
  } catch (error) {
    res.status(401).send({ error: 'Unauthorized' });
  }
}
