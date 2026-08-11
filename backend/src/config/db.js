const mysql = require('mysql2/promise');

/**
 * A shared connection pool. Every repository borrows a connection from
 * here instead of opening a new one per query, which is what you want
 * under real request load.
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});

module.exports = pool;
