const pool = require('../config/db');

async function findAll({ search, sortBy, order, limit, offset }) {
  const params = [];
  let whereClause = '';

  if (search) {
    whereClause = 'WHERE name LIKE ? OR description LIKE ?';
    const likeTerm = `%${search}%`;
    params.push(likeTerm, likeTerm);
  }

  // sortBy/order come from a whitelist (see queryHelpers.parseSort),
  // so they're safe to interpolate directly — only the user-supplied
  // *values* (search, limit, offset) go through `?` placeholders.
  const query = `
    SELECT id, name, description, created_at, updated_at
    FROM departments
    ${whereClause}
    ORDER BY ${sortBy} ${order}
    LIMIT ? OFFSET ?
  `;
  const [rows] = await pool.query(query, [...params, limit, offset]);
  return rows;
}

async function countAll({ search }) {
  const params = [];
  let whereClause = '';

  if (search) {
    whereClause = 'WHERE name LIKE ? OR description LIKE ?';
    const likeTerm = `%${search}%`;
    params.push(likeTerm, likeTerm);
  }

  const [rows] = await pool.query(`SELECT COUNT(*) AS total FROM departments ${whereClause}`, params);
  return rows[0].total;
}

async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, name, description, created_at, updated_at FROM departments WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function create({ name, description }) {
  const [result] = await pool.query('INSERT INTO departments (name, description) VALUES (?, ?)', [
    name,
    description || null,
  ]);
  return findById(result.insertId);
}

async function update(id, { name, description }) {
  await pool.query('UPDATE departments SET name = ?, description = ? WHERE id = ?', [
    name,
    description || null,
    id,
  ]);
  return findById(id);
}

// Returns whether a row was actually deleted, so the service can
// distinguish "already gone" (404) from a real failure.
async function remove(id) {
  const [result] = await pool.query('DELETE FROM departments WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { findAll, countAll, findById, create, update, remove };
