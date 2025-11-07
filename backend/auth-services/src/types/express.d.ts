
import 'express-serve-static-core';

import 'express-rate-limit';



declare module 'express-rate-limit' {
  import { Request, Response, NextFunction } from 'express';

  interface RateLimitRequestHandler {
    (req: Request, res: Response, next: NextFunction): void;
  }

  interface Options {
    windowMs?: number;
    max?: number;
    message?: string | object;
    statusCode?: number;
    headers?: boolean;
    skipFailedRequests?: boolean;
    skipSuccessfulRequests?: boolean;
    standardHeaders?: boolean;
    legacyHeaders?: boolean;
    keyGenerator?: (req: Request) => string;
    skip?: (req: Request) => boolean;
    handler?: (req: Request, res: Response) => void;
  }

  function rateLimit(options?: Options): RateLimitRequestHandler;
  export = rateLimit;
}


declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      sub: string;
      role?: string;
    };
  }
}
