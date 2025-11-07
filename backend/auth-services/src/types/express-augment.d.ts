// src/types/express-augment.d.ts

// 1) Augment express-serve-static-core safely (adds req.user)
import 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      sub: string;
      role?: string;
    };
  }
}

// 2) (Optional) Provide types for express-rate-limit if your installed version lacks types.
// NOTE: If your installed express-rate-limit already ships types, remove this block to avoid conflicts.
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

// Make this a module (avoids global augmentation pitfalls in some setups)
export {};