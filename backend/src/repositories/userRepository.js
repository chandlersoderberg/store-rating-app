const pool = require('../config/db');

const ALLOWED_SORT_FIELDS = ['name', 'email', 'address', 'role', 'created_at'];

const sanitizeSort = (sortBy, sortOrder) => {
  const field = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'name';
  const order = String(sortOrder).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  return { field, order };
};

const findByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
};

const findById = async (id) => {
  const [rows] = await pool.query(
    'SELECT id, name, email, address, role, created_at FROM users WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
};

const create = async ({ name, email, password, address, role }) => {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
    [name, email, password, address, role]
  );
  return findById(result.insertId);
};

const updatePassword = async (id, hashedPassword) => {
  await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
};

/**
 * Lists all users with optional filters and sorting, used by
 * the admin's "manage users" screen.
 */
const findAllUsers = async ({ name, email, address, role, sortBy, sortOrder }) => {
  const { field, order } = sanitizeSort(sortBy, sortOrder);
  const conditions = ["1=1"];
  const params = [];

  if (name) {
    conditions.push('name LIKE ?');
    params.push(`%${name}%`);
  }
  if (email) {
    conditions.push('email LIKE ?');
    params.push(`%${email}%`);
  }
  if (address) {
    conditions.push('address LIKE ?');
    params.push(`%${address}%`);
  }
  if (role && ['ADMIN', 'NORMAL', 'OWNER'].includes(role)) {
    conditions.push('role = ?');
    params.push(role);
  }

  const sql = `
    SELECT id, name, email, address, role, created_at
    FROM users
    WHERE ${conditions.join(' AND ')}
    ORDER BY ${field} ${order}
  `;

  const [rows] = await pool.query(sql, params);
  return rows;
};

/** Fetches a user plus, if they are a Store Owner, their store's average rating. */
const findDetailedById = async (id) => {
  const user = await findById(id);
  if (!user) return null;

  if (user.role !== 'OWNER') return user;

  const [rows] = await pool.query(
    `SELECT ROUND(AVG(r.rating), 2) AS avgRating
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     WHERE s.owner_id = ?`,
    [id]
  );

  return { ...user, rating: rows[0]?.avgRating ? Number(rows[0].avgRating) : null };
};

const countAll = async () => {
  const [rows] = await pool.query('SELECT COUNT(*) AS total FROM users');
  return rows[0].total;
};

module.exports = {
  findByEmail,
  findById,
  create,
  updatePassword,
  findAllUsers,
  findDetailedById,
  countAll,
};
