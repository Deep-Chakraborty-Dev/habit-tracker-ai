/**
 * Wraps an async Express handler so thrown errors go to the error-handling middleware.
 * Usage: router.get('/route', asyncHandler(myController));
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
