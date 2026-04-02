import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import corsOptions from './config/cors.js';
import { globalLimiter } from './config/rateLimiter.js';

const app = express();

// HTTP header protection
app.use(helmet());
// CORS configured
app.use(cors(corsOptions));
// Rate limiting for all requests
app.use(globalLimiter);

// body size limit
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

export default app;