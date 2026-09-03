const express = require('express');
const departmentController = require('../controllers/department.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');

const router = express.Router();

// Every department route requires a logged-in user; only Admins may
// create, edit, or delete, since both Students and Courses reference
// departments and unrestricted changes here would ripple everywhere.
router.use(authenticate);

router.get('/', departmentController.getAll);
router.get('/:id', departmentController.getOne);
router.post('/', authorize('Admin'), departmentController.create);
router.put('/:id', authorize('Admin'), departmentController.update);
router.delete('/:id', authorize('Admin'), departmentController.remove);

module.exports = router;
