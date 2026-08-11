/**
 * A lightweight error type carrying an HTTP status code, so any layer of
 * the app can throw `new ApiError(404, 'Store not found')` and the error
 * middleware knows exactly how to respond.
 */
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
