const departmentModel = require('../models/department.model');
const AppError = require('../utils/AppError');
const { parsePagination, buildPaginationMeta, parseSort } = require('../utils/queryHelpers');

const SORTABLE_COLUMNS = ['name', 'created_at', 'updated_at'];

async function listDepartments(query) {
  const { page, limit, offset } = parsePagination(query);
  const { sortBy, order } = parseSort(query, SORTABLE_COLUMNS, 'name');
  const search = query.search ? query.search.trim() : undefined;

  const [rows, total] = await Promise.all([
    departmentModel.findAll({ search, sortBy, order, limit, offset }),
    departmentModel.countAll({ search }),
  ]);

  return { rows, pagination: buildPaginationMeta(page, limit, total) };
}

async function getDepartment(id) {
  const department = await departmentModel.findById(id);
  if (!department) {
    throw new AppError('Department not found', 404);
  }
  return department;
}

function validateDepartmentInput({ name }) {
  if (!name || !name.trim()) {
    throw new AppError('Department name is required.', 422);
  }
}

async function createDepartment(data) {
  validateDepartmentInput(data);
  // Trimmed before persisting — without this, "Computer Science" and
  // "Computer Science " (trailing space) would pass the UNIQUE
  // constraint as two different values despite looking identical.
  const trimmed = { name: data.name.trim(), description: data.description?.trim() || null };
  return departmentModel.create(trimmed);
}

async function updateDepartment(id, data) {
  validateDepartmentInput(data);
  // Confirms the department exists first so the caller gets a clean
  // 404 instead of a silent no-op update.
  await getDepartment(id);
  const trimmed = { name: data.name.trim(), description: data.description?.trim() || null };
  return departmentModel.update(id, trimmed);
}

async function deleteDepartment(id) {
  const deleted = await departmentModel.remove(id);
  if (!deleted) {
    throw new AppError('Department not found', 404);
  }
}

module.exports = { listDepartments, getDepartment, createDepartment, updateDepartment, deleteDepartment };
