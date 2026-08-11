const ApiError = require('../utils/ApiError');
const {
  isValidName,
  isValidAddress,
  isValidEmail,
  isValidPassword,
} = require('../utils/validationRules');

const validateSignup = (req, res, next) => {
  const { name, email, address, password } = req.body;
  const errors = [];

  if (!isValidName(name)) errors.push('Name must be between 20 and 60 characters.');
  if (!isValidEmail(email)) errors.push('A valid email address is required.');
  if (!isValidAddress(address)) errors.push('Address must not exceed 400 characters.');
  if (!isValidPassword(password))
    errors.push(
      'Password must be 8-16 characters and include at least one uppercase letter and one special character.'
    );

  if (errors.length) return next(new ApiError(400, 'Validation failed', errors));
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ApiError(400, 'Email and password are required.'));
  }
  next();
};

const validatePasswordUpdate = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const errors = [];

  if (!currentPassword) errors.push('Current password is required.');
  if (!isValidPassword(newPassword)) {
    errors.push(
      'New password must be 8-16 characters and include at least one uppercase letter and one special character.'
    );
  }

  if (errors.length) return next(new ApiError(400, 'Validation failed', errors));
  next();
};

module.exports = { validateSignup, validateLogin, validatePasswordUpdate };
