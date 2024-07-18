// controllers/studentController.js
const StudentDataGlobales = require('../models/students_datos_globales');

exports.createStudent = async (req, res) => {
  try {
    const student = new StudentDataGlobales(req.body);
    await student.save();
    res.status(201).send(student);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getStudents = async (req, res) => {
  try {
    const students = await StudentDataGlobales.find({});
    res.status(200).send(students);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getStudent = async (req, res) => {
  try {
    const student = await StudentDataGlobales.findById(req.params.id);
    if (!student) {
      return res.status(404).send();
    }
    res.status(200).send(student);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await StudentDataGlobales.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!student) {
      return res.status(404).send();
    }
    res.status(200).send(student);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await StudentDataGlobales.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).send();
    }
    res.status(200).send(student);
  } catch (error) {
    res.status(500).send(error);
  }
};
