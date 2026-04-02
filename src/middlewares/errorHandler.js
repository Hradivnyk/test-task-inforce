import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Developer sees full error in logs
  logger.error({ status, message, stack: err.stack });

  // Client receives clean JSON
  res.status(status).json({
    error: {
      message,
      // Stack trace only in development — not in production
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

export default errorHandler;
