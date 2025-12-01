import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { logger } from './utils/logger';
import { configureRoutes } from './routes';
import { loadConfig } from './config';
import { requestLogger } from './middleware/requestLogger';
import { rateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const config = loadConfig();

// Configure 'trust proxy' from environment if provided. Avoid using the
// permissive boolean `true` which can allow trivial bypasses of IP-based
// rate limiting. Prefer a numeric value (number of trusted proxies) or a
// specific address string (e.g. 'loopback'). If not set, leave Express's
// default (no trusted proxies).
const rawTrustProxy = process.env.TRUST_PROXY ?? process.env.TRUST_PROXY_COUNT;
if (typeof rawTrustProxy !== 'undefined') {
  const asNum = Number(rawTrustProxy);
  if (!Number.isNaN(asNum)) {
    app.set('trust proxy', asNum);
  } else {
    // Use the string value (e.g. 'loopback', '127.0.0.1')
    app.set('trust proxy', String(rawTrustProxy));
  }
}

// Security middleware
app.use(helmet());
app.use(cors());


// Request logging
app.use(requestLogger);

// Rate limiting
app.use(rateLimiter);

// Configure routes
configureRoutes(app);

//Parse body after routing
app.use(express.json());

// Error handling
app.use(errorHandler);

const PORT = config.port || 3000;

app.listen(PORT, () => {
  logger.info(`API Gateway listening on port ${PORT}`);
  logger.info(`Environment: ${config.nodeEnv}`);
});