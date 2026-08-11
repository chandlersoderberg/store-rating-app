const ApiError = require('../utils/ApiError');
const { hashPassword } = require('../utils/hash');
const userRepository = require('../repositories/userRepository');
const storeRepository = require('../repositories/storeRepository');
const ratingRepository = require('../repositories/ratingRepository');

const getDashboardStats = async () => {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    userRepository.countAll(),
    storeRepository.countAll(),
    ratingRepository.countAll(),
  ]);
  return { totalUsers, totalStores, totalRatings };
};

const createUser = async ({ name, email, address, password, role }) => {
  const existing = await userRepository.findByEmail(email);
  if (existing) throw new ApiError(409, 'An account with this email already exists.');

  const hashedPassword = await hashPassword(password);
  return userRepository.create({ name, email, password: hashedPassword, address, role });
};

const createStore = async ({ name, email, address, ownerId }) => {
  if (ownerId) {
    const owner = await userRepository.findById(ownerId);
    if (!owner) throw new ApiError(404, 'Selected store owner does not exist.');
  }
  const storeId = await storeRepository.create({ name, email, address, owner_id: ownerId });
  return storeRepository.findById(storeId);
};

const listUsers = (filters) => userRepository.findAllUsers(filters);

const listStores = (filters) => storeRepository.findAllForAdmin(filters);

const getUserDetail = async (id) => {
  const user = await userRepository.findDetailedById(id);
  if (!user) throw new ApiError(404, 'User not found.');
  return user;
};

module.exports = {
  getDashboardStats,
  createUser,
  createStore,
  listUsers,
  listStores,
  getUserDetail,
};
