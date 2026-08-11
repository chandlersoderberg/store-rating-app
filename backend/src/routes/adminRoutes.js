const express = require('express');
const adminController = require('../controllers/adminController');
const authenticate = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/roleMiddleware');
const { validateCreateUser } = require('../validators/userValidator');
const { validateCreateStore } = require('../validators/storeValidator');

const router = express.Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.listUsers);
router.get('/users/:id', adminController.getUserDetail);
router.post('/users', validateCreateUser, adminController.createUser);
router.get('/stores', adminController.listStores);
router.post('/stores', validateCreateStore, adminController.createStore);

module.exports = router;
