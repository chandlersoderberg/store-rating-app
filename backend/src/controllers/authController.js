const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/authService');

const signup = asyncHandler(async (req, res) => {
  const { user, token } = await authService.signup(req.body);
  const { password, ...safeUser } = user;
  res.status(201).json({ success: true, data: { user: safeUser, token } });
});

const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.login(req.body);
  res.status(200).json({ success: true, data: { user, token } });
});

const changePassword = asyncHandler(async (req, res) => {
  await authService.updatePassword(req.user.id, req.body);
  res.status(200).json({ success: true, message: 'Password updated successfully.' });
});

module.exports = { signup, login, changePassword };
