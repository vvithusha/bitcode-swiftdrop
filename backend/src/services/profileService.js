const AppError = require('../middleware/appError');
const userRepository = require('../repositories/userRepository');
const purchaseRepository = require('../repositories/purchaseRepository');

const getProfile = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }
  return user;
};

const updateProfile = async (userId, displayName) => {
  if (!displayName) {
    throw new AppError('displayName is required', 400, 'VALIDATION_ERROR');
  }
  return userRepository.updateDisplayName(userId, displayName);
};

const getOrders = async (userId) => {
  return purchaseRepository.listOrdersByUser(userId);
};

module.exports = {
  getProfile,
  updateProfile,
  getOrders
};
