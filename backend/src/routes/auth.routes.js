const express = require('express');
const authController = require('../controllers/auth.controller');
const authenticate = require('../middleware/auth.middleware');

// Routes only declare the URL -> controller mapping; request handling
// logic itself lives in the controller, and business rules live in
// the service layer.
const router = express.Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
