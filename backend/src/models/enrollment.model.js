const pool = require('../config/db');

// Joins in student and course details so the enrollment list can
// display "Emma Johnson — Introduction to Programming" without the
// frontend needing separate lookups for every row.
const BASE_SELECT = `
  SELECT e.id, e.student_id,
         CONCAT(s.first_name, ' ', s.last_name) AS student_name,
         s.student_id AS student_code,
         e.course_id, c.course_name, c.course_code,
         e.enrollment_date, e.semester, e.academic_year, e.status,
         e.created_at, e.updated_at
  FROM enrollments e
  JOIN students s ON s.id = e.student_id
  JOIN courses c ON c.id = e.course_id
`;

function buildFilters({ studentId, courseId, status }) {
  const conditions = [];
  const params = [];

  if (studentId) {
    conditions.push('e.student_id = ?');
    params.push(studentId);
  }
  if (courseId) {
    conditions.push('e.course_id = ?');
    params.push(courseId);
  }
  if (status) {
    conditions.push('e.status = ?');
    params.push(status);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return { whereClause, params };
}

async function findAll({ studentId, courseId, status, sortBy, order, limit, offset }) {
  const { whereClause, params } = buildFilters({ studentId, courseId, status });
  const query = `${BASE_SELECT} ${whereClause} ORDER BY e.${sortBy} ${order} LIMIT ? OFFSET ?`;
  const [rows] = await pool.query(query, [...params, limit, offset]);
  return rows;
}

async function countAll({ studentId, courseId, status }) {
  const { whereClause, params } = buildFilters({ studentId, courseId, status });
  const [rows] = await pool.query(`SELECT COUNT(*) AS total FROM enrollments e ${whereClause}`, params);
  return rows[0].total;
}

async function findRecent(limit = 5) {
  const [rows] = await pool.query(`${BASE_SELECT} ORDER BY e.created_at DESC LIMIT ?`, [limit]);
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(`${BASE_SELECT} WHERE e.id = ?`, [id]);
  return rows[0] || null;
}

// Used by the service to give a specific, friendly duplicate-enrollment
// message before the insert is attempted — the database's UNIQUE
// constraint is still the ultimate backstop if two requests race.
async function findDuplicate({ student_id, course_id, semester, academic_year }) {
  const [rows] = await pool.query(
    'SELECT id FROM enrollments WHERE student_id = ? AND course_id = ? AND semester = ? AND academic_year = ?',
    [student_id, course_id, semester, academic_year]
  );
  return rows[0] || null;
}

async function create({ student_id, course_id, enrollment_date, semester, academic_year, status }) {
  const [result] = await pool.query(
    `INSERT INTO enrollments (student_id, course_id, enrollment_date, semester, academic_year, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [student_id, course_id, enrollment_date, semester, academic_year, status || 'Active']
  );
  return findById(result.insertId);
}

async function update(id, { enrollment_date, semester, academic_year, status }) {
  await pool.query(
    'UPDATE enrollments SET enrollment_date = ?, semester = ?, academic_year = ?, status = ? WHERE id = ?',
    [enrollment_date, semester, academic_year, status, id]
  );
  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM enrollments WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

async function countTotal() {
  const [rows] = await pool.query('SELECT COUNT(*) AS total FROM enrollments');
  return rows[0].total;
}

module.exports = {
  findAll, countAll, findRecent, findById, findDuplicate, create, update, remove, countTotal,
};
