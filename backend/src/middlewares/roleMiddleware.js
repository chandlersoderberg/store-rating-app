const ApiError = require('../utils/ApiError');

/**
 * Usage: router.get('/admin-only', authenticate, authorize('ADMIN'), handler)
 * Must run after `authenticate` so req.user is already populated.
 */
const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return next(new ApiError(403, 'You do not have permission to perform this action.'));
  }
  next();
};

module.exports = authorize;
