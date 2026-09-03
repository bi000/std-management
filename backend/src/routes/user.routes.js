const express = require('express');
const userController = require('../controllers/user.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');

const router = express.Router();

// Every route here is Admin-only — Staff cannot view or manage system
// users, per the role rules in the spec.
router.use(authenticate, authorize('Admin'));

router.get('/', userController.getAll);
router.get('/:id', userController.getOne);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.remove);

module.exports = router;
