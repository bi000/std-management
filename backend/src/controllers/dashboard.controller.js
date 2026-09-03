const dashboardService = require('../services/dashboard.service');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');

const getStats = catchAsync(async (req, res) => {
  const stats = await dashboardService.getStats();
  sendSuccess(res, 200, 'Dashboard stats retrieved successfully', stats);
});

module.exports = { getStats };
