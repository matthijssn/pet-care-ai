import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { loadConfig } from '../config';

const config = loadConfig();

export const petRouter = Router();

const options = {
  target: config.petServiceUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/api/pets': '',
  },
};

const petProxy = createProxyMiddleware(options);
petRouter.use('/', petProxy);