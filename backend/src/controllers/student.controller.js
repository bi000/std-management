const studentService = require('../services/student.service');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');

const getAll = catchAsync(async (req, res) => {
  const { rows, pagination } = await studentService.listStudents(req.query);
  sendSuccess(res, 200, 'Students retrieved successfully', rows, pagination);
});

const getOne = catchAsync(async (req, res) => {
  const student = await studentService.getStudent(req.params.id);
  sendSuccess(res, 200, 'Student retrieved successfully', student);
});

const create = catchAsync(async (req, res) => {
  const student = await studentService.createStudent(req.body);
  sendSuccess(res, 201, 'Student created successfully', student);
});

const update = catchAsync(async (req, res) => {
  const student = await studentService.updateStudent(req.params.id, req.body);
  sendSuccess(res, 200, 'Student updated successfully', student);
});

const remove = catchAsync(async (req, res) => {
  await studentService.deleteStudent(req.params.id);
  sendSuccess(res, 200, 'Student deleted successfully');
});

module.exports = { getAll, getOne, create, update, remove };
