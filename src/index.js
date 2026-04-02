import app from './app.js';
import config from './config/index.js';
import logger from './utils/logger.js';

const PORT = config.server.port;

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${config.server.port}`);
});
