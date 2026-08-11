const ApiError = require('../utils/ApiError');
const { isValidRating } = require('../utils/validationRules');

const validateSubmitRating = (req, res, next) => {
  const { rating } = req.body;
  if (!isValidRating(Number(rating))) {
    return next(new ApiError(400, 'Rating must be a whole number between 1 and 5.'));
  }
  req.body.rating = Number(rating);
  next();
};

module.exports = { validateSubmitRating };
