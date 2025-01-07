const Student = require('../../models/graduadoscpcs/studentGraduate');

// Crear un nuevo estudiante
const saveStudent = async (req, res) => {
  try {
    const studentData = req.body; // Los datos del estudiante provienen del cuerpo de la solicitud
    const newStudent = new Student(studentData); // Crear un nuevo objeto Student con los datos
    await newStudent.save(); // Guardar el estudiante en la base de datos
    res.status(201).json({ message: 'Estudiante guardado exitosamente', student: newStudent });
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar el estudiante', error: error.message });
  }
};

// Obtener todos los estudiantes
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find(); // Buscar todos los estudiantes en la base de datos
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estudiantes', error: error.message });
  }
};

 

const searchStudents = async (req, res) => {
  const { nombre, numDocumento } = req.query;

  try {
    // Crear el filtro dinámico
    const filter = {};
    if (nombre) {
      filter.nombre = { $regex: new RegExp(nombre.trim(), 'i') }; // Regex para búsqueda flexible
    }
    if (numDocumento) {
      filter.numDocumento = numDocumento; // Búsqueda exacta
    }

    // Consultar la base de datos
    const students = await Student.find(filter);

    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar estudiantes', error: error.message });
  }
};




// Actualizar un estudiante por su código de matrícula
const updateStudent = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const student = await Student.findOneAndUpdate({ codigoMatricula: id }, updatedData, { new: true });
    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado para actualizar' });
    }
    res.status(200).json({ message: 'Estudiante actualizado exitosamente', student });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el estudiante', error: error.message });
  }
};

// Eliminar un estudiante por su código de matrícula
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
  // getStudentById,
  searchStudents,
  updateStudent,
  deleteStudent
};
