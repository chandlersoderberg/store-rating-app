const express = require('express');
const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authMiddleware');
const {
  validateSignup,
  validateLogin,
  validatePasswordUpdate,
} = require('../validators/authValidator');

const router = express.Router();

router.post('/signup', validateSignup, authController.signup);
router.post('/login', validateLogin, authController.login);
router.patch('/password', authenticate, validatePasswordUpdate, authController.changePassword);

module.exports = router;
