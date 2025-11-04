import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { loadConfig } from '../config';

const config = loadConfig();

export const authRouter = Router();

// Proxy middleware options
const options = {
  target: config.authServiceUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '', // remove /api/auth prefix when forwarding
  },
  onProxyReq: (proxyReq: any) => {
    // Add any request transformations here
  },
  onProxyRes: (proxyRes: any) => {
    // Add any response transformations here
  },
  onError: (err: Error) => {
    console.error('Proxy Error:', err);
  },
};

// Create the proxy middleware
const authProxy = createProxyMiddleware(options);

// Use the proxy middleware for all routes
authRouter.use('/', authProxy);