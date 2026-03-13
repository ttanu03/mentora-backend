const Session = require('../models/Session');
const Lesson = require('../models/Lesson');
const Booking = require('../models/Booking');

exports.createSession = async (req, res) => {
  try {
    const { lessonId, date, topic, summary } = req.body;

    // Only mentor who owns the lesson can create a session
    const lesson = await Lesson.findOne({ _id: lessonId, mentor: req.user._id });
    if (!lesson) return res.status(403).json({ error: 'Lesson not found or not owned by you' });

    const session = await Session.create({ lesson: lessonId, date, topic, summary });
    res.status(201).json({ session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSessionsByLesson = async (req, res) => {
  try {
    const sessions = await Session.find({ lesson: req.params.id }).sort({ date: 1 });
    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Bonus: join a session
exports.joinSession = async (req, res) => {
  try {
    const { studentId } = req.body;
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    // Check student has a booking for this lesson
    const booking = await Booking.findOne({ student: studentId, lesson: session.lesson });
    if (!booking) return res.status(403).json({ error: 'Student is not booked for this lesson' });

    if (session.attendees.includes(studentId)) {
      return res.status(409).json({ error: 'Student already joined this session' });
    }

    session.attendees.push(studentId);
    await session.save();
    res.json({ message: 'Student joined session', session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
