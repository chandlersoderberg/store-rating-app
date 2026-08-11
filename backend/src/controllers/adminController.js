const asyncHandler = require('../utils/asyncHandler');
const adminService = require('../services/adminService');

const getDashboard = asyncHandler(async (req, res) => {
  const stats = await adminService.getDashboardStats();
  res.status(200).json({ success: true, data: stats });
});

const createUser = asyncHandler(async (req, res) => {
  const user = await adminService.createUser(req.body);
  res.status(201).json({ success: true, data: user });
});

const createStore = asyncHandler(async (req, res) => {
  const { name, email, address, ownerId } = req.body;
  const store = await adminService.createStore({ name, email, address, ownerId });
  res.status(201).json({ success: true, data: store });
});

const listUsers = asyncHandler(async (req, res) => {
  const { name, email, address, role, sortBy, sortOrder } = req.query;
  const users = await adminService.listUsers({ name, email, address, role, sortBy, sortOrder });
  res.status(200).json({ success: true, data: users });
});

const listStores = asyncHandler(async (req, res) => {
  const { name, email, address, sortBy, sortOrder } = req.query;
  const stores = await adminService.listStores({ name, email, address, sortBy, sortOrder });
  res.status(200).json({ success: true, data: stores });
});

const getUserDetail = asyncHandler(async (req, res) => {
  const user = await adminService.getUserDetail(req.params.id);
  res.status(200).json({ success: true, data: user });
});

module.exports = { getDashboard, createUser, createStore, listUsers, listStores, getUserDetail };
