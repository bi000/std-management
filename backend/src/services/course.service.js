const courseModel = require('../models/course.model');
const AppError = require('../utils/AppError');
const { parsePagination, buildPaginationMeta, parseSort } = require('../utils/queryHelpers');

const SORTABLE_COLUMNS = ['course_code', 'course_name', 'credit_hours', 'created_at'];

async function listCourses(query) {
  const { page, limit, offset } = parsePagination(query);
  const { sortBy, order } = parseSort(query, SORTABLE_COLUMNS, 'course_code');
  const search = query.search ? query.search.trim() : undefined;
  const departmentId = query.department_id || undefined;

  const [rows, total] = await Promise.all([
    courseModel.findAll({ search, departmentId, sortBy, order, limit, offset }),
    courseModel.countAll({ search, departmentId }),
  ]);

  return { rows, pagination: buildPaginationMeta(page, limit, total) };
}

async function getCourse(id) {
  const course = await courseModel.findById(id);
  if (!course) {
    throw new AppError('Course not found', 404);
  }
  return course;
}

function validateCourseInput({ course_code, course_name, credit_hours }) {
  if (!course_code || !course_code.trim()) {
    throw new AppError('Course code is required.', 422);
  }
  if (!course_name || !course_name.trim()) {
    throw new AppError('Course name is required.', 422);
  }
  const hours = Number(credit_hours);
  // Mirrors the database's CHECK constraint (1-10) so a bad value is
  // rejected with a clear message before it even reaches the query,
  // rather than surfacing as a generic database error.
  if (!Number.isInteger(hours) || hours < 1 || hours > 10) {
    throw new AppError('Credit hours must be a whole number between 1 and 10.', 422);
  }
}

async function createCourse(data) {
  validateCourseInput(data);
  // Trimmed for the same reason as departments — avoids
  // whitespace-padded values slipping past the UNIQUE constraint on
  // course_code as if they were distinct.
  const trimmed = {
    ...data,
    course_code: data.course_code.trim(),
    course_name: data.course_name.trim(),
    description: data.description?.trim() || null,
  };
  return courseModel.create(trimmed);
}

async function updateCourse(id, data) {
  validateCourseInput(data);
  await getCourse(id);
  const trimmed = {
    ...data,
    course_code: data.course_code.trim(),
    course_name: data.course_name.trim(),
    description: data.description?.trim() || null,
  };
  return courseModel.update(id, trimmed);
}

async function deleteCourse(id) {
  const deleted = await courseModel.remove(id);
  if (!deleted) {
    throw new AppError('Course not found', 404);
  }
}

module.exports = { listCourses, getCourse, createCourse, updateCourse, deleteCourse };
