const asyncHandler = require('../utils/asyncHandler');
const storeService = require('../services/storeService');

const listStores = asyncHandler(async (req, res) => {
  const { search, sortBy, sortOrder } = req.query;
  const stores = await storeService.listStoresForUser(req.user.id, {
    search,
    sortBy,
    sortOrder,
  });
  res.status(200).json({ success: true, data: stores });
});

module.exports = { listStores };
