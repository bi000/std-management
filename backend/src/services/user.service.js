const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');
const AppError = require('../utils/AppError');
const { parsePagination, buildPaginationMeta, parseSort } = require('../utils/queryHelpers');

const SORTABLE_COLUMNS = ['name', 'email', 'role', 'status', 'created_at'];
const SALT_ROUNDS = 10;

async function listUsers(query) {
  const { page, limit, offset } = parsePagination(query);
  const { sortBy, order } = parseSort(query, SORTABLE_COLUMNS, 'name');
  const search = query.search ? query.search.trim() : undefined;

  const [rows, total] = await Promise.all([
    userModel.findAll({ search, sortBy, order, limit, offset }),
    userModel.countAll({ search }),
  ]);

  return { rows, pagination: buildPaginationMeta(page, limit, total) };
}

async function getUser(id) {
  const user = await userModel.findById(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
}

function validateEmail(email) {
  // A pragmatic check, not a full RFC 5322 validator — good enough to
  // catch typos without rejecting legitimate unusual addresses.
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

async function createUser({ name, email, password, role, status }) {
  // Trim first so merely-padded input (e.g. a stray leading space)
  // doesn't fail the strict email pattern below.
  name = (name || '').trim();
  email = (email || '').trim().toLowerCase();

  if (!name) {
    throw new AppError('Name is required.', 422);
  }
  if (!validateEmail(email)) {
    throw new AppError('A valid email is required.', 422);
  }
  if (!password || password.length < 8) {
    throw new AppError('Password must be at least 8 characters long.', 422);
  }
  if (!['Admin', 'Staff'].includes(role)) {
    throw new AppError('Role must be either "Admin" or "Staff".', 422);
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return userModel.create({
    name,
    email,
    hashedPassword,
    role,
    status: status === 'Inactive' ? 'Inactive' : 'Active',
  });
}

async function updateUser(id, { name, email, role, status }) {
  await getUser(id); // 404s early if the user doesn't exist
  name = (name || '').trim();
  email = (email || '').trim().toLowerCase();

  if (!name) {
    throw new AppError('Name is required.', 422);
  }
  if (!validateEmail(email)) {
    throw new AppError('A valid email is required.', 422);
  }
  if (!['Admin', 'Staff'].includes(role)) {
    throw new AppError('Role must be either "Admin" or "Staff".', 422);
  }
  if (!['Active', 'Inactive'].includes(status)) {
    throw new AppError('Status must be either "Active" or "Inactive".', 422);
  }
  return userModel.update(id, { name, email, role, status });
}

async function deleteUser(id, requestingUserId) {
  // Blocks an admin from deleting their own account through this
  // endpoint — doing so mid-session would invalidate the token
  // they're currently using, leading to a confusing dead end.
  if (Number(id) === Number(requestingUserId)) {
    throw new AppError('You cannot delete your own account while logged in.', 400);
  }
  const deleted = await userModel.remove(id);
  if (!deleted) {
    throw new AppError('User not found', 404);
  }
}

module.exports = { listUsers, getUser, createUser, updateUser, deleteUser };
