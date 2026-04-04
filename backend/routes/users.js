const express = require('express');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { validate } = require('../utils/validation');
const userController = require('../controllers/userController');
const { userSchemas, commonSchemas } = require('../utils/validation');

const router = express.Router();

// Admin routes
router.get('/',
  authenticate,
  requireAdmin,
  validate(commonSchemas.pagination, 'query'),
  userController.getUsers
);

router.get('/students',
  authenticate,
  requireAdmin,
  validate(commonSchemas.pagination, 'query'),
  userController.getStudents
);

router.get('/search',
  authenticate,
  requireAdmin,
  validate(commonSchemas.search, 'query'),
  userController.searchUsers
);

router.get('/:id',
  authenticate,
  requireAdmin,
  validate(commonSchemas.id, 'params'),
  userController.getUserById
);

router.post('/',
  authenticate,
  requireAdmin,
  validate(userSchemas.create, 'body'),
  userController.createUser
);

router.put('/:id',
  authenticate,
  requireAdmin,
  validate(commonSchemas.id, 'params'),
  validate(userSchemas.update, 'body'),
  userController.updateUser
);

router.delete('/:id',
  authenticate,
  requireAdmin,
  validate(commonSchemas.id, 'params'),
  userController.deleteUser
);

router.put('/:id/activate',
  authenticate,
  requireAdmin,
  validate(commonSchemas.id, 'params'),
  userController.activateUser
);

router.put('/:id/deactivate',
  authenticate,
  requireAdmin,
  validate(commonSchemas.id, 'params'),
  userController.deactivateUser
);

router.get('/:id/courses',
  authenticate,
  requireAdmin,
  validate(commonSchemas.id, 'params'),
  userController.getUserCourses
);

router.get('/:id/enrollments',
  authenticate,
  requireAdmin,
  validate(commonSchemas.id, 'params'),
  userController.getUserEnrollments
);

router.put('/:id/plan-type',
  authenticate,
  requireAdmin,
  validate(commonSchemas.id, 'params'),
  userController.updateUserPlan
);

module.exports = router;


