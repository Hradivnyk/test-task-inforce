import logger from '../utils/logger.js';
import config from '../config/index.js';

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  logger.error({ status, message, stack: err.stack });

  res.status(status).json({
    error: {
      message,
      ...(config.server.isDev && { stack: err.stack }),
    },
  });
};

export default errorHandler;
