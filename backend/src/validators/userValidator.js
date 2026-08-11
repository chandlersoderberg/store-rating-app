const ApiError = require('../utils/ApiError');
const {
  isValidName,
  isValidAddress,
  isValidEmail,
  isValidPassword,
  isValidRole,
} = require('../utils/validationRules');

const validateCreateUser = (req, res, next) => {
  const { name, email, address, password, role } = req.body;
  const errors = [];

  if (!isValidName(name)) errors.push('Name must be between 20 and 60 characters.');
  if (!isValidEmail(email)) errors.push('A valid email address is required.');
  if (!isValidAddress(address)) errors.push('Address must not exceed 400 characters.');
  if (!isValidPassword(password))
    errors.push(
      'Password must be 8-16 characters and include at least one uppercase letter and one special character.'
    );
  if (!isValidRole(role)) errors.push('Role must be one of ADMIN, NORMAL, OWNER.');

  if (errors.length) return next(new ApiError(400, 'Validation failed', errors));
  next();
};

module.exports = { validateCreateUser };
