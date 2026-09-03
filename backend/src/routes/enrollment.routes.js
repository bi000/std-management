const express = require('express');
const enrollmentController = require('../controllers/enrollment.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');

const router = express.Router();

router.use(authenticate);

// Unlike students, both Admin and Staff can fully manage enrollments
// per the spec, so there's no extra authorize() call needed beyond
// being logged in.
router.get('/', enrollmentController.getAll);
router.get('/:id', enrollmentController.getOne);
router.post('/', authorize('Admin', 'Staff'), enrollmentController.create);
router.put('/:id', authorize('Admin', 'Staff'), enrollmentController.update);
router.delete('/:id', authorize('Admin', 'Staff'), enrollmentController.remove);

module.exports = router;
