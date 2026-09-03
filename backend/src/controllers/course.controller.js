const courseService = require('../services/course.service');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');

const getAll = catchAsync(async (req, res) => {
  const { rows, pagination } = await courseService.listCourses(req.query);
  sendSuccess(res, 200, 'Courses retrieved successfully', rows, pagination);
});

const getOne = catchAsync(async (req, res) => {
  const course = await courseService.getCourse(req.params.id);
  sendSuccess(res, 200, 'Course retrieved successfully', course);
});

const create = catchAsync(async (req, res) => {
  const course = await courseService.createCourse(req.body);
  sendSuccess(res, 201, 'Course created successfully', course);
});

const update = catchAsync(async (req, res) => {
  const course = await courseService.updateCourse(req.params.id, req.body);
  sendSuccess(res, 200, 'Course updated successfully', course);
});

const remove = catchAsync(async (req, res) => {
  await courseService.deleteCourse(req.params.id);
  sendSuccess(res, 200, 'Course deleted successfully');
});

module.exports = { getAll, getOne, create, update, remove };
