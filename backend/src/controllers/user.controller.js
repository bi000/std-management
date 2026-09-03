const userService = require('../services/user.service');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');

const getAll = catchAsync(async (req, res) => {
  const { rows, pagination } = await userService.listUsers(req.query);
  sendSuccess(res, 200, 'Users retrieved successfully', rows, pagination);
});

const getOne = catchAsync(async (req, res) => {
  const user = await userService.getUser(req.params.id);
  sendSuccess(res, 200, 'User retrieved successfully', user);
});

const create = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  sendSuccess(res, 201, 'User created successfully', user);
});

const update = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  sendSuccess(res, 200, 'User updated successfully', user);
});

const remove = catchAsync(async (req, res) => {
  await userService.deleteUser(req.params.id, req.user.id);
  sendSuccess(res, 200, 'User deleted successfully');
});

module.exports = { getAll, getOne, create, update, remove };
