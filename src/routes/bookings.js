const router = require('express').Router();
const { body } = require('express-validator');
const { createBooking, getBookings } = require('../controllers/bookingController');
const { authenticate, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(authenticate, requireRole('parent'));

router.post(
  '/',
  [
    body('studentId').notEmpty().isMongoId().withMessage('Valid studentId is required'),
    body('lessonId').notEmpty().isMongoId().withMessage('Valid lessonId is required'),
  ],
  validate,
  createBooking
);

router.get('/', getBookings);

module.exports = router;
