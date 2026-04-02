import app from './app.js';
import config from './config/index.js';
import logger from './utils/logger.js';
import { connectDB } from './config/database.js';

const startServer = async () => {
  await connectDB();

  app.listen(config.server.port, () => {
    logger.info(`Server running on http://localhost:${config.server.port}`);
  });
};

process.on('unhandledRejection', (error) => {
  logger.error({ error }, 'Unhandled Rejection');
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error({ error }, 'Uncaught Exception');
  process.exit(1);
});

startServer();
