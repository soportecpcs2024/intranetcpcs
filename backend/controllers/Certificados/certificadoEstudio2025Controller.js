const Student = require('../../models/Certificados/certificadoEstudio2025');

const saveStudent = async (req, res) => {
  try {
    const studentData = req.body;
    const newStudent = new Student(studentData);
    await newStudent.save();
    res.status(201).json({ message: 'Estudiante guardado exitosamente', student: newStudent });
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar el estudiante', error: error.message });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estudiantes', error: error.message });
  }
};

const searchStudents = async (req, res) => {
  const { nombre, numDocumento } = req.query;

  try {
    const filter = {};

    if (nombre && nombre.trim() !== '') {
      filter.nombre = { $regex: nombre.trim(), $options: 'i' };
    }

    if (numDocumento && numDocumento.trim() !== '') {
      filter.numDocumento = numDocumento.trim();
    }

    const students = await Student.find(filter);

    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar estudiantes', error: error.message });
  }
};

const updateStudent = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const student = await Student.findOneAndUpdate(
      { codigoMatricula: id },
      updatedData,
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado para actualizar' });
    }

    res.status(200).json({ message: 'Estudiante actualizado exitosamente', student });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el estudiante', error: error.message });
  }
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findOneAndDelete({ codigoMatricula: id });

    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado para eliminar' });
    }

    res.status(200).json({ message: 'Estudiante eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el estudiante', error: error.message });
  }
};

module.exports = {
  saveStudent,
  getAllStudents,
  searchStudents,
  updateStudent,
  deleteStudent
};