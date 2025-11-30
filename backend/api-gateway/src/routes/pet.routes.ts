import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { loadConfig } from '../config';

const config = loadConfig();

export const petRouter = Router();

// Proxy middleware options
const options = {
  target: config.petServiceUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/api/pets': '/pets', // remove /api/auth prefix when forwarding
  },
  proxyTimeout: 30000, // 30 seconds
  timeout: 30000,
  retry: 3,
  onProxyReq: (proxyReq: any, req: any) => {
    // Log outgoing request for debugging
    console.log(`[Pets Proxy] Forwarding ${req.method} request to ${config.authServiceUrl}${req.url}`);
  },
  onProxyRes: (proxyRes: any, req: any) => {
    // Log successful proxy response
    console.log(`[Pets Proxy] Received ${proxyRes.statusCode} response for ${req.method} ${req.url}`);
  },
  onError: (err: Error, req: any, res: any) => {
    console.error(`[Pets Proxy] Error proxying ${req.method} ${req.url}:`, err.message);
    
    // Send a proper error response to the client
    if (!res.headersSent) {
      res.status(502).json({
        error: 'Bad Gateway',
        message: 'Unable to reach pets service. Please try again later.',
        code: 'PETS_SERVICE_UNAVAILABLE'
      });
    }
  },
  // Configure WebSocket support
  ws: true,
  secure: true,
  xfwd: true,
  // Configure keep-alive
  agent: false,
  // Additional error handling
  logLevel: 'debug' as const,
  logProvider: () => console
};

// Create the proxy middleware
const petsProxy = createProxyMiddleware(options);

// Use the proxy middleware for all routes
petRouter.use('/', petsProxy);