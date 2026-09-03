const pool = require('../config/db');

// A handful of small, targeted queries rather than one giant join —
// each one maps directly to a single dashboard card, which keeps
// them easy to read and to change independently later.
async function getCounts() {
  const [[{ total: totalDepartments }]] = await pool.query('SELECT COUNT(*) AS total FROM departments');
  const [[{ total: totalCourses }]] = await pool.query('SELECT COUNT(*) AS total FROM courses');
  const [[{ total: totalEnrollments }]] = await pool.query('SELECT COUNT(*) AS total FROM enrollments');
  const [studentStatusRows] = await pool.query(
    'SELECT status, COUNT(*) AS count FROM students GROUP BY status'
  );

  const studentCounts = { total: 0, active: 0, inactive: 0, graduated: 0 };
  for (const row of studentStatusRows) {
    studentCounts.total += row.count;
    if (row.status === 'Active') studentCounts.active = row.count;
    if (row.status === 'Inactive') studentCounts.inactive = row.count;
    if (row.status === 'Graduated') studentCounts.graduated = row.count;
  }

  return { studentCounts, totalDepartments, totalCourses, totalEnrollments };
}

module.exports = { getCounts };
