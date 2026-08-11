const ApiError = require('../utils/ApiError');

/**
 * Single place where every thrown/forwarded error ends up. Keeps
 * controllers free of res.status(...).json(...) boilerplate for
 * failure cases.
 */
const errorHandler = (err, req, res, next) => {
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'A record with these details already exists.',
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.details || undefined,
    });
  }

  console.error('Unexpected error:', err);
  return res.status(500).json({
    success: false,
    message: 'Something went wrong on the server.',
  });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
};

module.exports = { errorHandler, notFoundHandler };
