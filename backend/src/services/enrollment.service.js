const enrollmentModel = require('../models/enrollment.model');
const studentModel = require('../models/student.model');
const courseModel = require('../models/course.model');
const AppError = require('../utils/AppError');
const { parsePagination, buildPaginationMeta, parseSort } = require('../utils/queryHelpers');

const SORTABLE_COLUMNS = ['enrollment_date', 'semester', 'academic_year', 'status', 'created_at'];
const VALID_SEMESTERS = ['Fall', 'Spring', 'Summer'];
const VALID_STATUSES = ['Active', 'Completed', 'Dropped'];

async function listEnrollments(query) {
  const { page, limit, offset } = parsePagination(query);
  const { sortBy, order } = parseSort(query, SORTABLE_COLUMNS, 'enrollment_date');
  const studentId = query.student_id || undefined;
  const courseId = query.course_id || undefined;
  const status = VALID_STATUSES.includes(query.status) ? query.status : undefined;

  const [rows, total] = await Promise.all([
    enrollmentModel.findAll({ studentId, courseId, status, sortBy, order, limit, offset }),
    enrollmentModel.countAll({ studentId, courseId, status }),
  ]);

  return { rows, pagination: buildPaginationMeta(page, limit, total) };
}

async function getEnrollment(id) {
  const enrollment = await enrollmentModel.findById(id);
  if (!enrollment) {
    throw new AppError('Enrollment not found', 404);
  }
  return enrollment;
}

function validateEnrollmentInput({ semester, academic_year, enrollment_date, status }) {
  if (!semester || !VALID_SEMESTERS.includes(semester)) {
    throw new AppError('Semester must be Fall, Spring, or Summer.', 422);
  }
  // Matches the format used throughout seed.sql, e.g. "2024-2025".
  if (!academic_year || !/^\d{4}-\d{4}$/.test(academic_year)) {
    throw new AppError('Academic year must be in the format YYYY-YYYY.', 422);
  }
  if (!enrollment_date || Number.isNaN(Date.parse(enrollment_date))) {
    throw new AppError('A valid enrollment date is required.', 422);
  }
  if (status && !VALID_STATUSES.includes(status)) {
    throw new AppError('Status must be Active, Completed, or Dropped.', 422);
  }
}

async function createEnrollment(data) {
  const { student_id, course_id } = data;
  if (!student_id || !course_id) {
    throw new AppError('Both student and course are required.', 422);
  }
  validateEnrollmentInput(data);

  // Validate the referenced student and course actually exist before
  // attempting the insert, so a bad ID produces a clear 404 rather
  // than a foreign-key error surfacing from the database layer.
  const [student, course] = await Promise.all([
    studentModel.findById(student_id),
    courseModel.findById(course_id),
  ]);
  if (!student) throw new AppError('The selected student does not exist.', 404);
  if (!course) throw new AppError('The selected course does not exist.', 404);

  const duplicate = await enrollmentModel.findDuplicate(data);
  if (duplicate) {
    throw new AppError(
      'This student is already enrolled in this course for the given semester and academic year.',
      409
    );
  }

  return enrollmentModel.create(data);
}

async function updateEnrollment(id, data) {
  validateEnrollmentInput(data);
  await getEnrollment(id);
  return enrollmentModel.update(id, data);
}

async function deleteEnrollment(id) {
  const deleted = await enrollmentModel.remove(id);
  if (!deleted) {
    throw new AppError('Enrollment not found', 404);
  }
}

module.exports = { listEnrollments, getEnrollment, createEnrollment, updateEnrollment, deleteEnrollment };
