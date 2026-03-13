const Lesson = require('../models/Lesson');

exports.createLesson = async (req, res) => {
  try {
    const { title, description } = req.body;
    const lesson = await Lesson.create({ title, description, mentor: req.user._id });
    res.status(201).json({ lesson });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find().populate('mentor', 'name email');
    res.json({ lessons });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
