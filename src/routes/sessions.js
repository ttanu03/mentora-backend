const router = require('express').Router();
const { body, param } = require('express-validator');
const { createSession, getSessionsByLesson, joinSession } = require('../controllers/sessionController');
const { authenticate, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');

// POST /sessions — mentor only
router.post(
  '/',
  authenticate,
  requireRole('mentor'),
  [
    body('lessonId').notEmpty().isMongoId().withMessage('Valid lessonId is required'),
    body('date').isISO8601().withMessage('Valid ISO date is required'),
    body('topic').notEmpty().withMessage('Topic is required'),
    body('summary').optional().isString(),
  ],
  validate,
  createSession
);

// GET /lessons/:id/sessions — any authenticated user
router.get(
  '/lessons/:id/sessions',
  authenticate,
  [param('id').isMongoId().withMessage('Valid lesson id is required')],
  validate,
  getSessionsByLesson
);

// POST /sessions/:id/join — parent only (bonus)
router.post(
  '/:id/join',
  authenticate,
  requireRole('parent'),
  [
    body('studentId').notEmpty().isMongoId().withMessage('Valid studentId is required'),
  ],
  validate,
  joinSession
);

module.exports = router;
