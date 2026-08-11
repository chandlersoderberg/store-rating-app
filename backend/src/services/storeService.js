const storeRepository = require('../repositories/storeRepository');

const listStoresForUser = (userId, filters) =>
  storeRepository.findAllForNormalUser(userId, filters);

module.exports = { listStoresForUser };
