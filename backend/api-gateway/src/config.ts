import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  port: z.number().default(3000),
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  authServiceUrl: z.string().url(),
  petServiceUrl: z.string().url(),
  billingServiceUrl: z.string().url(),
  remindersServiceUrl: z.string().url(),
  rateLimitWindowMs: z.number().default(900000),
  rateLimitMaxRequests: z.number().default(100),
  logLevel: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

export type Config = z.infer<typeof configSchema>;

export function loadConfig(): Config {
  return configSchema.parse({
    port: Number(process.env.PORT),
    nodeEnv: process.env.NODE_ENV,
    authServiceUrl: process.env.AUTH_SERVICE_URL,
    petServiceUrl: process.env.PET_SERVICE_URL,
    billingServiceUrl: process.env.BILLING_SERVICE_URL,
    remindersServiceUrl: process.env.REMINDERS_SERVICE_URL,
    rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS),
    rateLimitMaxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS),
    logLevel: process.env.LOG_LEVEL as Config['logLevel'],
  });
}