const pool = require('../config/db');

// Joins in the department name so list/detail views don't need a
// second round-trip just to show which department a course belongs to.
const BASE_SELECT = `
  SELECT c.id, c.course_code, c.course_name, c.description, c.credit_hours,
         c.department_id, d.name AS department_name, c.created_at, c.updated_at
  FROM courses c
  LEFT JOIN departments d ON d.id = c.department_id
`;

function buildFilters({ search, departmentId }) {
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push('(c.course_code LIKE ? OR c.course_name LIKE ?)');
    const likeTerm = `%${search}%`;
    params.push(likeTerm, likeTerm);
  }
  if (departmentId) {
    conditions.push('c.department_id = ?');
    params.push(departmentId);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return { whereClause, params };
}

async function findAll({ search, departmentId, sortBy, order, limit, offset }) {
  const { whereClause, params } = buildFilters({ search, departmentId });
  const query = `${BASE_SELECT} ${whereClause} ORDER BY c.${sortBy} ${order} LIMIT ? OFFSET ?`;
  const [rows] = await pool.query(query, [...params, limit, offset]);
  return rows;
}

async function countAll({ search, departmentId }) {
  const { whereClause, params } = buildFilters({ search, departmentId });
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS total FROM courses c ${whereClause}`,
    params
  );
  return rows[0].total;
}

async function findById(id) {
  const [rows] = await pool.query(`${BASE_SELECT} WHERE c.id = ?`, [id]);
  return rows[0] || null;
}

async function create({ course_code, course_name, description, credit_hours, department_id }) {
  const [result] = await pool.query(
    'INSERT INTO courses (course_code, course_name, description, credit_hours, department_id) VALUES (?, ?, ?, ?, ?)',
    [course_code, course_name, description || null, credit_hours, department_id || null]
  );
  return findById(result.insertId);
}

async function update(id, { course_code, course_name, description, credit_hours, department_id }) {
  await pool.query(
    'UPDATE courses SET course_code = ?, course_name = ?, description = ?, credit_hours = ?, department_id = ? WHERE id = ?',
    [course_code, course_name, description || null, credit_hours, department_id || null, id]
  );
  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM courses WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { findAll, countAll, findById, create, update, remove };
