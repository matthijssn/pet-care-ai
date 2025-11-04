import { Express } from 'express';
import { authRouter } from './auth.routes';
import { petRouter } from './pet.routes';
import { billingRouter } from './billing.routes';
import { remindersRouter } from './reminders.routes';

export function configureRoutes(app: Express) {
  app.use('/api/auth', authRouter);
  app.use('/api/pets', petRouter);
  app.use('/api/billing', billingRouter);
  app.use('/api/reminders', remindersRouter);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
  });
}