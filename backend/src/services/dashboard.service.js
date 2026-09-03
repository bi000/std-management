const dashboardModel = require('../models/dashboard.model');
const studentModel = require('../models/student.model');
const enrollmentModel = require('../models/enrollment.model');

async function getStats() {
  const [counts, recentStudents, recentEnrollments] = await Promise.all([
    dashboardModel.getCounts(),
    studentModel.findRecent(5),
    enrollmentModel.findRecent(5),
  ]);

  return {
    students: {
      total: counts.studentCounts.total,
      active: counts.studentCounts.active,
      inactive: counts.studentCounts.inactive,
      graduated: counts.studentCounts.graduated,
    },
    totalDepartments: counts.totalDepartments,
    totalCourses: counts.totalCourses,
    totalEnrollments: counts.totalEnrollments,
    recentStudents,
    recentEnrollments,
  };
}

module.exports = { getStats };
