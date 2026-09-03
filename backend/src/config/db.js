const mysql = require('mysql2/promise');
require('dotenv').config();

// A connection pool (rather than a single connection) lets multiple
// requests query the database concurrently without waiting on each
// other, and automatically re-establishes dropped connections.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
