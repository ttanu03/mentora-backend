const router = require('express').Router();
const { body } = require('express-validator');
const { createLesson, getLessons } = require('../controllers/lessonController');
const { authenticate, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.get('/', authenticate, getLessons);

router.post(
  '/',
  authenticate,
  requireRole('mentor'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
  ],
  validate,
  createLesson
);

module.exports = router;
