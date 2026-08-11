const ApiError = require('../utils/ApiError');
const { verifyToken } = require('../utils/jwt');

/**
 * Reads the Bearer token, verifies it, and attaches the decoded payload
 * (id, role) to req.user for downstream handlers/middlewares to use.
 */
const authenticate = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authentication token missing.'));
  }

  const token = header.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    next(new ApiError(401, 'Invalid or expired token.'));
  }
};

module.exports = authenticate;
