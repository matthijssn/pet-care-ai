import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { loadConfig } from '../config';

const config = loadConfig();

export const billingRouter = Router();

const options = {
  target: config.billingServiceUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/api/billing': '',
  },
};

const billingProxy = createProxyMiddleware(options);
billingRouter.use('/', billingProxy);