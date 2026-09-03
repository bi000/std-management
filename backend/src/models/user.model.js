const pool = require('../config/db');

// All queries use `?` placeholders. mysql2 escapes the bound values
// itself, which is what actually prevents SQL injection — string
// concatenation into a query is never used anywhere in this model.

// Includes the password hash. Only used internally by the auth
// service to verify a login attempt — never returned in an API response.
async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}

const SAFE_COLUMNS = 'id, name, email, role, status, created_at, updated_at';

// Excludes the password column entirely, so callers that only need a
// safe user profile (e.g. GET /api/auth/me) can't accidentally leak it.
async function findById(id) {
  const [rows] = await pool.query(`SELECT ${SAFE_COLUMNS} FROM users WHERE id = ?`, [id]);
  return rows[0] || null;
}

async function findAll({ search, sortBy, order, limit, offset }) {
  const params = [];
  let whereClause = '';
  if (search) {
    whereClause = 'WHERE name LIKE ? OR email LIKE ?';
    const likeTerm = `%${search}%`;
    params.push(likeTerm, likeTerm);
  }
  const query = `SELECT ${SAFE_COLUMNS} FROM users ${whereClause} ORDER BY ${sortBy} ${order} LIMIT ? OFFSET ?`;
  const [rows] = await pool.query(query, [...params, limit, offset]);
  return rows;
}

async function countAll({ search }) {
  const params = [];
  let whereClause = '';
  if (search) {
    whereClause = 'WHERE name LIKE ? OR email LIKE ?';
    const likeTerm = `%${search}%`;
    params.push(likeTerm, likeTerm);
  }
  const [rows] = await pool.query(`SELECT COUNT(*) AS total FROM users ${whereClause}`, params);
  return rows[0].total;
}

// `hashedPassword` is already a bcrypt hash by the time it reaches
// this function — hashing itself happens one layer up, in the
// service, keeping the model focused purely on data access.
async function create({ name, email, hashedPassword, role, status }) {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
    [name, email, hashedPassword, role, status]
  );
  return findById(result.insertId);
}

// Password is intentionally NOT updatable through this generic
// update — changing a password is a distinct, more sensitive
// operation, and isn't required by this project's scope.
async function update(id, { name, email, role, status }) {
  await pool.query('UPDATE users SET name = ?, email = ?, role = ?, status = ? WHERE id = ?', [
    name,
    email,
    role,
    status,
    id,
  ]);
  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { findByEmail, findById, findAll, countAll, create, update, remove };

