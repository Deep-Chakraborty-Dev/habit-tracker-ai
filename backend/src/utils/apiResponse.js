/**
 * Consistent API response helper.
 * Always returns { success, data, message }.
 */
class ApiResponse {
  /**
   * @param {number}  statusCode
   * @param {*}       data
   * @param {string}  message
   */
  static success(res, data = null, message = 'OK', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      data,
      message,
    });
  }

  static created(res, data = null, message = 'Created') {
    return ApiResponse.success(res, data, message, 201);
  }

  static error(res, message = 'Internal Server Error', statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      error: message,
    });
  }
}

module.exports = ApiResponse;
