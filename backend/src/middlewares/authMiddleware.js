const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/apiResponse');
const logger = require('../config/logger');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    logger.warn({ path: req.path }, 'Authentication attempt without Bearer token');
    return errorResponse(res, 'Access denied. No token provided.', 401);
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    logger.warn({ path: req.path }, 'Authentication attempt with invalid/expired token');
    return errorResponse(res, 'Invalid or expired authentication token.', 401);
  }

  req.user = decoded;
  next();
};

module.exports = { authenticateToken };
