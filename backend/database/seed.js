/**
 * One-time seed script — creates the first System Administrator account
 * so there is a way to log in and start adding stores/users.
 *
 * Usage:  npm run seed
 */
require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../src/config/db');

const ADMIN = {
  name: 'System Administrator Account',
  email: 'admin@storerating.com',
  password: 'Admin@1234',
  address: 'Head Office, Platform HQ',
};

async function seed() {
  const connection = await pool.getConnection();
  try {
    const [existing] = await connection.query(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [ADMIN.email]
    );

    if (existing.length > 0) {
      console.log(`Admin account already exists (${ADMIN.email}). Nothing to do.`);
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN.password, 10);

    await connection.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [ADMIN.name, ADMIN.email, hashedPassword, ADMIN.address, 'ADMIN']
    );

    console.log('Admin account created successfully:');
    console.log(`  email:    ${ADMIN.email}`);
    console.log(`  password: ${ADMIN.password}`);
    console.log('Please log in and change this password.');
  } catch (err) {
    console.error('Seeding failed:', err.message);
  } finally {
    connection.release();
    await pool.end();
  }
}

seed();
