const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

/**
 * Global error-handling middleware.
 * Catches ApiError instances and unknown errors, returning a consistent JSON envelope.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  console.error('❌ Error:', err.message);

  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return ApiResponse.error(res, messages.join(', '), 400);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(', ');
    return ApiResponse.error(res, `Duplicate value for: ${field}`, 409);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.error(res, 'Invalid token', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return ApiResponse.error(res, 'Token expired', 401);
  }

  // Custom ApiError
  if (err instanceof ApiError) {
    return ApiResponse.error(res, err.message, err.statusCode);
  }

  // Fallback
  return ApiResponse.error(res, 'Internal Server Error', 500);
};

module.exports = errorHandler;
