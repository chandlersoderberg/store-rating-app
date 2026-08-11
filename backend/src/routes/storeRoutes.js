const express = require('express');
const storeController = require('../controllers/storeController');
const authenticate = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');

const router = express.Router();

router.get('/', authenticate, authorize('NORMAL'), storeController.listStores);

module.exports = router;
