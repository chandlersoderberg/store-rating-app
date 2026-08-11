const express = require('express');
const ratingController = require('../controllers/ratingController');
const authenticate = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');
const { validateSubmitRating } = require('../validators/ratingValidator');

const router = express.Router();

router.post(
  '/stores/:storeId',
  authenticate,
  authorize('NORMAL'),
  validateSubmitRating,
  ratingController.submitRating
);

router.get(
  '/owner/dashboard',
  authenticate,
  authorize('OWNER'),
  ratingController.getOwnerDashboard
);

module.exports = router;
