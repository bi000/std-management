const pool = require('../config/db');

const BASE_SELECT = `
  SELECT s.id, s.student_id, s.first_name, s.last_name, s.email, s.phone,
         s.date_of_birth, s.gender, s.address, s.department_id,
         d.name AS department_name, s.enrollment_date, s.status,
         s.created_at, s.updated_at
  FROM students s
  LEFT JOIN departments d ON d.id = s.department_id
`;

function buildFilters({ search, departmentId, status }) {
  const conditions = [];
  const params = [];

  if (search) {
    conditions.push(
      '(s.student_id LIKE ? OR s.first_name LIKE ? OR s.last_name LIKE ? OR s.email LIKE ?)'
    );
    const likeTerm = `%${search}%`;
    params.push(likeTerm, likeTerm, likeTerm, likeTerm);
  }
  if (departmentId) {
    conditions.push('s.department_id = ?');
    params.push(departmentId);
  }
  if (status) {
    conditions.push('s.status = ?');
    params.push(status);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return { whereClause, params };
}

async function findAll({ search, departmentId, status, sortBy, order, limit, offset }) {
  const { whereClause, params } = buildFilters({ search, departmentId, status });
  const query = `${BASE_SELECT} ${whereClause} ORDER BY s.${sortBy} ${order} LIMIT ? OFFSET ?`;
  const [rows] = await pool.query(query, [...params, limit, offset]);
  return rows;
}

async function countAll({ search, departmentId, status }) {
  const { whereClause, params } = buildFilters({ search, departmentId, status });
  const [rows] = await pool.query(`SELECT COUNT(*) AS total FROM students s ${whereClause}`, params);
  return rows[0].total;
}

// Recent students for the dashboard — newest first, small fixed limit.
async function findRecent(limit = 5) {
  const [rows] = await pool.query(`${BASE_SELECT} ORDER BY s.created_at DESC LIMIT ?`, [limit]);
  return rows;
}

async function countByStatus() {
  const [rows] = await pool.query('SELECT status, COUNT(*) AS count FROM students GROUP BY status');
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(`${BASE_SELECT} WHERE s.id = ?`, [id]);
  return rows[0] || null;
}

async function create(data) {
  const {
    student_id, first_name, last_name, email, phone,
    date_of_birth, gender, address, department_id, enrollment_date, status,
  } = data;
  const [result] = await pool.query(
    `INSERT INTO students
      (student_id, first_name, last_name, email, phone, date_of_birth, gender, address, department_id, enrollment_date, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      student_id, first_name, last_name, email, phone || null,
      date_of_birth || null, gender || null, address || null,
      department_id || null, enrollment_date || null, status || 'Active',
    ]
  );
  return findById(result.insertId);
}

async function update(id, data) {
  const {
    student_id, first_name, last_name, email, phone,
    date_of_birth, gender, address, department_id, enrollment_date, status,
  } = data;
  await pool.query(
    `UPDATE students SET
      student_id = ?, first_name = ?, last_name = ?, email = ?, phone = ?,
      date_of_birth = ?, gender = ?, address = ?, department_id = ?,
      enrollment_date = ?, status = ?
     WHERE id = ?`,
    [
      student_id, first_name, last_name, email, phone || null,
      date_of_birth || null, gender || null, address || null,
      department_id || null, enrollment_date || null, status, id,
    ]
  );
  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM students WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { findAll, countAll, findRecent, countByStatus, findById, create, update, remove };
