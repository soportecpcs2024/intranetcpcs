const Estudiante = require('../../models/EPadres/EstudianteModel');

// Crear estudiante
const crearEstudiante = async (req, res) => {
  try {
    const { codigo, nombre, documento, grupo, grado } = req.body;

    // Verificar si ya existe
    const existe = await Estudiante.findOne({ documento });
    if (existe) {
      return res.status(400).json({ message: 'Estudiante ya registrado' });
    }

    const nuevoEstudiante = new Estudiante({
      codigo,
      nombre,
      documento,
      grupo,
      grado
    });

    await nuevoEstudiante.save();
    res.status(201).json({ message: 'Estudiante creado', estudiante: nuevoEstudiante });
  } catch (error) {
    console.error('Error al crear estudiante:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener todos los estudiantes
const getEstudiantes = async (req, res) => {
  try {
    const estudiantes = await Estudiante.find().sort({ nombre: 1 });
    res.json(estudiantes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estudiantes' });
  }
};

// Buscar estudiante por nombre o identificación
const buscarEstudiante = async (req, res) => {
  try {
    const q = req.query.q?.toLowerCase() || '';

    // Buscar solo por coincidencia en el campo nombre
    const estudiantes = await Estudiante.find({
      nombre: { $regex: q, $options: 'i' }
    }).limit(20);

    res.json(estudiantes);
  } catch (error) {
    console.error('Error al buscar estudiante:', error);
    res.status(500).json({ message: 'Error al buscar estudiante' });
  }
};


module.exports = {
  crearEstudiante,
  getEstudiantes,
  buscarEstudiante,
};
