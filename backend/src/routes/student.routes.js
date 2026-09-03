const express = require('express');
const studentController = require('../controllers/student.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');

const router = express.Router();

router.use(authenticate);

// Staff can view, create, and update students, but the spec
// explicitly withholds delete rights from Staff — only an Admin can
// permanently remove a student record.
router.get('/', studentController.getAll);
router.get('/:id', studentController.getOne);
router.post('/', authorize('Admin', 'Staff'), studentController.create);
router.put('/:id', authorize('Admin', 'Staff'), studentController.update);
router.delete('/:id', authorize('Admin'), studentController.remove);

module.exports = router;
