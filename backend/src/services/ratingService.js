const ApiError = require('../utils/ApiError');
const storeRepository = require('../repositories/storeRepository');
const ratingRepository = require('../repositories/ratingRepository');

const submitRating = async (userId, storeId, rating) => {
  const store = await storeRepository.findById(storeId);
  if (!store) throw new ApiError(404, 'Store not found.');

  await ratingRepository.upsert(userId, storeId, rating);
};

/** Store Owner dashboard: raters list + average, scoped to their own store. */
const getOwnerDashboard = async (ownerId) => {
  const store = await storeRepository.findByOwnerId(ownerId);
  if (!store) throw new ApiError(404, 'No store is linked to this account yet.');

  const [raters, { avgRating, totalRatings }] = await Promise.all([
    ratingRepository.findRatersForStore(store.id),
    ratingRepository.getAverageForStore(store.id),
  ]);

  return { store, raters, avgRating, totalRatings };
};

module.exports = { submitRating, getOwnerDashboard };
