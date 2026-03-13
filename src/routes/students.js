const router = require('express').Router();
const { body } = require('express-validator');
const { createStudent, getStudents } = require('../controllers/studentController');
const { authenticate, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(authenticate, requireRole('parent'));

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('age').optional().isInt({ min: 1, max: 100 }).withMessage('Age must be between 1 and 100'),
    body('grade').optional().isString(),
  ],
  validate,
  createStudent
);

router.get('/', getStudents);

module.exports = router;
