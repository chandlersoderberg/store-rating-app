const pool = require('../config/db');

const ALLOWED_SORT_FIELDS = ['name', 'email', 'address', 'rating'];

const sanitizeSort = (sortBy, sortOrder) => {
  const field = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'name';
  const order = String(sortOrder).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  return { field, order };
};

const create = async ({ name, email, address, owner_id }) => {
  const [result] = await pool.query(
    'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
    [name, email || null, address || null, owner_id || null]
  );
  return result.insertId;
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM stores WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
};

/** Admin listing: all stores with their computed average rating. */
const findAllForAdmin = async ({ name, email, address, sortBy, sortOrder }) => {
  const { field, order } = sanitizeSort(sortBy, sortOrder);
  const conditions = [];
  const params = [];

  if (name) {
    conditions.push('s.name LIKE ?');
    params.push(`%${name}%`);
  }
  if (email) {
    conditions.push('s.email LIKE ?');
    params.push(`%${email}%`);
  }
  if (address) {
    conditions.push('s.address LIKE ?');
    params.push(`%${address}%`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const sql = `
    SELECT s.id, s.name, s.email, s.address,
           ROUND(AVG(r.rating), 2) AS rating
    FROM stores s
    LEFT JOIN ratings r ON r.store_id = s.id
    ${whereClause}
    GROUP BY s.id
    ORDER BY ${field === 'rating' ? 'rating' : `s.${field}`} ${order}
  `;

  const [rows] = await pool.query(sql, params);
  return rows;
};

/**
 * Normal-user listing: all stores with the overall average rating and,
 * if this user has rated the store, their own submitted rating.
 */
const findAllForNormalUser = async (userId, { name, address, sortBy, sortOrder }) => {
  const { field, order } = sanitizeSort(sortBy, sortOrder);
  const conditions = [];
  const params = [userId];

  if (name) {
    conditions.push('s.name LIKE ?');
    params.push(`%${name}%`);
  }
  if (address) {
    conditions.push('s.address LIKE ?');
    params.push(`%${address}%`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const sql = `
    SELECT s.id, s.name, s.address,
           ROUND(AVG(r.rating), 2) AS overallRating,
           MAX(CASE WHEN r.user_id = ? THEN r.rating END) AS userRating
    FROM stores s
    LEFT JOIN ratings r ON r.store_id = s.id
    ${whereClause}
    GROUP BY s.id
    ORDER BY ${field === 'rating' ? 'overallRating' : `s.${field}`} ${order}
  `;

  const [rows] = await pool.query(sql, params);
  return rows;
};

const countAll = async () => {
  const [rows] = await pool.query('SELECT COUNT(*) AS total FROM stores');
  return rows[0].total;
};

const findByOwnerId = async (ownerId) => {
  const [rows] = await pool.query('SELECT * FROM stores WHERE owner_id = ? LIMIT 1', [ownerId]);
  return rows[0] || null;
};

module.exports = {
  create,
  findById,
  findAllForAdmin,
  findAllForNormalUser,
  countAll,
  findByOwnerId,
};
