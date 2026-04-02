import rateLimit from 'express-rate-limit';
import config from './index.js';

const createLimiter = (options) => {
  // In production, this is an actual limit; otherwise, it simply skips it
  if (!config.server.isProd) return (req, res, next) => next();
  return rateLimit(options);
};

// Global rate limit for all requests
export const globalLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests, please try again later.',
  },
});

// Strict rate limit for authentication — protection from brute force
export const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error: 'Too many login attempts, please try again after 15 minutes.',
  },
});

// Public API rate limit
export const apiLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 30,
  message: {
    error: 'API rate limit exceeded.',
  },
});
