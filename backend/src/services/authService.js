const ApiError = require('../utils/ApiError');
const { hashPassword, comparePassword } = require('../utils/hash');
const { signToken } = require('../utils/jwt');
const userRepository = require('../repositories/userRepository');

const signup = async ({ name, email, address, password }) => {
  const existing = await userRepository.findByEmail(email);
  if (existing) throw new ApiError(409, 'An account with this email already exists.');

  const hashedPassword = await hashPassword(password);
  const user = await userRepository.create({
    name,
    email,
    password: hashedPassword,
    address,
    role: 'NORMAL',
  });

  const token = signToken({ id: user.id, role: user.role });
  return { user, token };
};

const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new ApiError(401, 'Invalid email or password.');

  const passwordMatches = await comparePassword(password, user.password);
  if (!passwordMatches) throw new ApiError(401, 'Invalid email or password.');

  const token = signToken({ id: user.id, role: user.role });
  const { password: _omit, ...safeUser } = user;
  return { user: safeUser, token };
};

const updatePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await userRepository.findByEmail((await userRepository.findById(userId)).email);
  const passwordMatches = await comparePassword(currentPassword, user.password);
  if (!passwordMatches) throw new ApiError(400, 'Current password is incorrect.');

  const hashedPassword = await hashPassword(newPassword);
  await userRepository.updatePassword(userId, hashedPassword);
};

module.exports = { signup, login, updatePassword };
