const enrollmentService = require('../services/enrollment.service');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');

const getAll = catchAsync(async (req, res) => {
  const { rows, pagination } = await enrollmentService.listEnrollments(req.query);
  sendSuccess(res, 200, 'Enrollments retrieved successfully', rows, pagination);
});

const getOne = catchAsync(async (req, res) => {
  const enrollment = await enrollmentService.getEnrollment(req.params.id);
  sendSuccess(res, 200, 'Enrollment retrieved successfully', enrollment);
});

const create = catchAsync(async (req, res) => {
  const enrollment = await enrollmentService.createEnrollment(req.body);
  sendSuccess(res, 201, 'Enrollment created successfully', enrollment);
});

const update = catchAsync(async (req, res) => {
  const enrollment = await enrollmentService.updateEnrollment(req.params.id, req.body);
  sendSuccess(res, 200, 'Enrollment updated successfully', enrollment);
});

const remove = catchAsync(async (req, res) => {
  await enrollmentService.deleteEnrollment(req.params.id);
  sendSuccess(res, 200, 'Enrollment deleted successfully');
});

module.exports = { getAll, getOne, create, update, remove };
