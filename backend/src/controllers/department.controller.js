const departmentService = require('../services/department.service');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');

const getAll = catchAsync(async (req, res) => {
  const { rows, pagination } = await departmentService.listDepartments(req.query);
  sendSuccess(res, 200, 'Departments retrieved successfully', rows, pagination);
});

const getOne = catchAsync(async (req, res) => {
  const department = await departmentService.getDepartment(req.params.id);
  sendSuccess(res, 200, 'Department retrieved successfully', department);
});

const create = catchAsync(async (req, res) => {
  const department = await departmentService.createDepartment(req.body);
  sendSuccess(res, 201, 'Department created successfully', department);
});

const update = catchAsync(async (req, res) => {
  const department = await departmentService.updateDepartment(req.params.id, req.body);
  sendSuccess(res, 200, 'Department updated successfully', department);
});

const remove = catchAsync(async (req, res) => {
  await departmentService.deleteDepartment(req.params.id);
  sendSuccess(res, 200, 'Department deleted successfully');
});

module.exports = { getAll, getOne, create, update, remove };
