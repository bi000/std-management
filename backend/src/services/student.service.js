const studentModel = require('../models/student.model');
const AppError = require('../utils/AppError');
const { parsePagination, buildPaginationMeta, parseSort } = require('../utils/queryHelpers');

const SORTABLE_COLUMNS = ['student_id', 'first_name', 'last_name', 'enrollment_date', 'status', 'created_at'];
const VALID_STATUSES = ['Active', 'Inactive', 'Graduated'];
const VALID_GENDERS = ['Male', 'Female', 'Other'];

async function listStudents(query) {
  const { page, limit, offset } = parsePagination(query);
  const { sortBy, order } = parseSort(query, SORTABLE_COLUMNS, 'last_name');
  const search = query.search ? query.search.trim() : undefined;
  const departmentId = query.department_id || undefined;
  const status = VALID_STATUSES.includes(query.status) ? query.status : undefined;

  const [rows, total] = await Promise.all([
    studentModel.findAll({ search, departmentId, status, sortBy, order, limit, offset }),
    studentModel.countAll({ search, departmentId, status }),
  ]);

  return { rows, pagination: buildPaginationMeta(page, limit, total) };
}

async function getStudent(id) {
  const student = await studentModel.findById(id);
  if (!student) {
    throw new AppError('Student not found', 404);
  }
  return student;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Accepts formats like "555-0101", "(555) 010-1234", "+1 555 010 1234".
const PHONE_PATTERN = /^[0-9+()\-.\s]{7,20}$/;

function validateStudentInput({ student_id, first_name, last_name, email, phone, date_of_birth, gender, status }) {
  if (!student_id || !student_id.trim()) {
    throw new AppError('Student ID is required.', 422);
  }
  if (!first_name || !first_name.trim()) {
    throw new AppError('First name is required.', 422);
  }
  if (!last_name || !last_name.trim()) {
    throw new AppError('Last name is required.', 422);
  }
  if (!email || !EMAIL_PATTERN.test(email)) {
    throw new AppError('A valid email is required.', 422);
  }
  if (phone && !PHONE_PATTERN.test(phone)) {
    throw new AppError('Phone number format is invalid.', 422);
  }
  if (date_of_birth && Number.isNaN(Date.parse(date_of_birth))) {
    throw new AppError('Date of birth is not a valid date.', 422);
  }
  if (gender && !VALID_GENDERS.includes(gender)) {
    throw new AppError('Gender must be Male, Female, or Other.', 422);
  }
  if (status && !VALID_STATUSES.includes(status)) {
    throw new AppError('Status must be Active, Inactive, or Graduated.', 422);
  }
}

async function createStudent(data) {
  // Trim first, then validate the trimmed value — otherwise merely
  // padded input (e.g. a leading space pasted into the email field)
  // fails validation even though the meaningful content is fine.
  const trimmed = trimStudentFields(data);
  validateStudentInput(trimmed);
  return studentModel.create(trimmed);
}

async function updateStudent(id, data) {
  const trimmed = trimStudentFields(data);
  validateStudentInput(trimmed);
  await getStudent(id);
  return studentModel.update(id, trimmed);
}

// Trims the free-text fields before they reach validation or the
// database, so "STU-2024-001 " (trailing space) can't sneak past the
// UNIQUE constraint as if it were a different student ID.
function trimStudentFields(data) {
  return {
    ...data,
    student_id: (data.student_id || '').trim(),
    first_name: (data.first_name || '').trim(),
    last_name: (data.last_name || '').trim(),
    email: (data.email || '').trim().toLowerCase(),
    phone: data.phone?.trim() || null,
    address: data.address?.trim() || null,
  };
}

async function deleteStudent(id) {
  const deleted = await studentModel.remove(id);
  if (!deleted) {
    throw new AppError('Student not found', 404);
  }
}

module.exports = { listStudents, getStudent, createStudent, updateStudent, deleteStudent };
