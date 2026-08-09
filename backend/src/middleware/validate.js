const { validationResult } = require('express-validator');
const ApiResponse = require('../utils/apiResponse');

/**
 * Middleware to handle express-validator validation results.
 * If errors exist, returns a 400 Bad Request with a clean string of errors.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors
      .array()
      .map((err) => `${err.path}: ${err.msg}`)
      .join(', ');
    return ApiResponse.error(res, errorMessages, 400);
  }
  next();
};

module.exports = validate;
