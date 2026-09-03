const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const authenticate = require('../middleware/auth.middleware');

const router = express.Router();

// Both Admin and Staff can view the dashboard — it's read-only
// aggregate data, not a management action.
router.get('/stats', authenticate, dashboardController.getStats);

module.exports = router;
