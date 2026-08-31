const app = require('./app');
const { initDatabase } = require('./config/db');
const logger = require('./config/logger');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await initDatabase();

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  } catch (error) {
    logger.error({ err: error }, 'Failed to start server');
    process.exit(1);
  }
}

startServer();
