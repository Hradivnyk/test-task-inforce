import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import corsOptions from './config/cors.js';
import { globalLimiter } from './config/rateLimiter.js';

import pinoHttp from 'pino-http';
import logger from './utils/logger.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

// HTTP header protection
app.use(helmet());
// CORS configured
app.use(cors(corsOptions));
// Rate limiting for all requests
app.use(globalLimiter);

// Logging
app.use(pinoHttp({ logger }));

// body size limit
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.use(errorHandler);

export default app;
