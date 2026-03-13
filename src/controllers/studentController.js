const Student = require('../models/Student');

exports.createStudent = async (req, res) => {
  try {
    const { name, age, grade } = req.body;
    const student = await Student.create({ name, age, grade, parent: req.user._id });
    res.status(201).json({ student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find({ parent: req.user._id });
    res.json({ students });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
