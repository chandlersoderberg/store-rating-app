const ApiError = require('../utils/ApiError');
const { isValidName, isValidAddress, isValidEmail } = require('../utils/validationRules');

const validateCreateStore = (req, res, next) => {
  const { name, email, address } = req.body;
  const errors = [];

  if (!isValidName(name)) errors.push('Store name must be between 20 and 60 characters.');
  if (email && !isValidEmail(email)) errors.push('Store email must be a valid email address.');
  if (!isValidAddress(address)) errors.push('Address must not exceed 400 characters.');

  if (errors.length) return next(new ApiError(400, 'Validation failed', errors));
  next();
};

module.exports = { validateCreateStore };
