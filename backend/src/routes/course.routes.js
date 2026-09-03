const express = require('express');
const courseController = require('../controllers/course.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/', courseController.getAll);
router.get('/:id', courseController.getOne);
router.post('/', authorize('Admin'), courseController.create);
router.put('/:id', authorize('Admin'), courseController.update);
router.delete('/:id', authorize('Admin'), courseController.remove);

module.exports = router;
