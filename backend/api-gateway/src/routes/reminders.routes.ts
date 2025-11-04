import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { loadConfig } from '../config';

const config = loadConfig();

export const remindersRouter = Router();

const options = {
  target: config.remindersServiceUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/api/reminders': '',
  },
};

const remindersProxy = createProxyMiddleware(options);
remindersRouter.use('/', remindersProxy);