const logger = require('../config/logger');
const { errorResponse } = require('../utils/apiResponse');

const globalErrorHandler = (err, req, res, next) => {
  logger.error(
    {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip
    },
    'Unhandled Server Exception'
  );

  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal Server Error';

  return errorResponse(res, message, statusCode, process.env.NODE_ENV === 'development' ? { stack: err.stack } : null);
};

const notFoundHandler = (req, res, next) => {
  logger.warn({ url: req.originalUrl, method: req.method }, 'Route not found');
  return errorResponse(res, `Route ${req.originalUrl} not found`, 404);
};

module.exports = {
  globalErrorHandler,
  notFoundHandler
};
