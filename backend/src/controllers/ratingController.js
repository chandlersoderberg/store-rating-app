const asyncHandler = require('../utils/asyncHandler');
const ratingService = require('../services/ratingService');

const submitRating = asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  const { rating } = req.body;
  await ratingService.submitRating(req.user.id, Number(storeId), rating);
  res.status(200).json({ success: true, message: 'Rating saved successfully.' });
});

const getOwnerDashboard = asyncHandler(async (req, res) => {
  const data = await ratingService.getOwnerDashboard(req.user.id);
  res.status(200).json({ success: true, data });
});

module.exports = { submitRating, getOwnerDashboard };
