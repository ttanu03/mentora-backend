const Booking = require('../models/Booking');
const Student = require('../models/Student');
const Lesson = require('../models/Lesson');

exports.createBooking = async (req, res) => {
  try {
    const { studentId, lessonId } = req.body;

    // Verify parent owns the student
    const student = await Student.findOne({ _id: studentId, parent: req.user._id });
    if (!student) return res.status(403).json({ error: 'Student not found or not owned by you' });

    // Verify lesson exists
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    const booking = await Booking.create({
      student: studentId,
      lesson: lessonId,
      bookedBy: req.user._id,
    });

    await booking.populate(['student', { path: 'lesson', populate: { path: 'mentor', select: 'name email' } }]);
    res.status(201).json({ booking });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Student is already booked for this lesson' });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const students = await Student.find({ parent: req.user._id }).select('_id');
    const studentIds = students.map((s) => s._id);
    const bookings = await Booking.find({ student: { $in: studentIds } }).populate('student lesson');
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
