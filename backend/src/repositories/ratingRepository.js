const pool = require('../config/db');

/**
 * Creates a new rating, or updates it if this user already rated this
 * store — relies on the (user_id, store_id) unique constraint.
 */
const upsert = async (userId, storeId, rating) => {
  await pool.query(
    `INSERT INTO ratings (user_id, store_id, rating)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE rating = VALUES(rating)`,
    [userId, storeId, rating]
  );
};

const countAll = async () => {
  const [rows] = await pool.query('SELECT COUNT(*) AS total FROM ratings');
  return rows[0].total;
};

/** All raters for a given store, with the rater's name and email — for the Store Owner dashboard. */
const findRatersForStore = async (storeId) => {
  const [rows] = await pool.query(
    `SELECT u.id AS userId, u.name, u.email, r.rating, r.updated_at AS ratedAt
     FROM ratings r
     JOIN users u ON u.id = r.user_id
     WHERE r.store_id = ?
     ORDER BY r.updated_at DESC`,
    [storeId]
  );
  return rows;
};

const getAverageForStore = async (storeId) => {
  const [rows] = await pool.query(
    'SELECT ROUND(AVG(rating), 2) AS avgRating, COUNT(*) AS totalRatings FROM ratings WHERE store_id = ?',
    [storeId]
  );
  return {
    avgRating: rows[0].avgRating ? Number(rows[0].avgRating) : null,
    totalRatings: rows[0].totalRatings,
  };
};

module.exports = { upsert, countAll, findRatersForStore, getAverageForStore };
