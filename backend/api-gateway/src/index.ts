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