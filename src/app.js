import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import config from './config/index.js';
import corsOptions from './config/cors.js';
import { globalLimiter } from './config/rateLimiter.js';

import pinoHttp from 'pino-http';
import logger from './utils/logger.js';
import { renderMarkdown } from './utils/renderMarkdown.js';
import errorHandler from './middlewares/errorHandler.js';

import authRouter from './routes/auth.routes.js';
import bookRouter from './routes/book.routes.js';
import userRouter from './routes/user.routes.js';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';

const app = express();

app.set('trust proxy', 1); // trust the first proxy (Nginx)

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
  res.send(renderMarkdown('Inforce API'));
});

if (!config.server.isProd) {
  app.use(
    '/api/docs',
    swaggerUi.serveFiles(swaggerSpec),
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: { persistAuthorization: true },
    }),
  );
}

app.use('/api/auth', authRouter);
app.use('/api/books', bookRouter);
app.use('/api/users', userRouter);

app.use((req, res) => {
  res.status(404).json({ error: { message: 'Route not found' } });
});

app.use(errorHandler);

export default app;
