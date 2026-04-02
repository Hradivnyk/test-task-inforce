import rateLimit from 'express-rate-limit';

// Global rate limit for all requests
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // maximum 100 requests
  standardHeaders: true,     // add RateLimit-* headers
  legacyHeaders: false,      // disable old X-RateLimit-* headers
  message: {
    error: 'Too many requests, please try again later.',
  },
});

// Strict rate limit for authentication — protection from brute force
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // only 10 attempts
  message: {
    error: 'Too many login attempts, please try again after 15 minutes.',
  },
});

// Public API rate limit
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,             // 30 requests per minute
  message: {
    error: 'API rate limit exceeded.',
  },
});