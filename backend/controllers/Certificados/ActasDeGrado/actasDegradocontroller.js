const EstudianteRecaudo = require('../../../models/Certificados/ActasDeGrado/actasDeGradoModel');

// Crear nuevo estudiante
const crearEstudianteActaGradoRecaudo = async (req, res) => {
  try {
    const nuevoEstudiante = new EstudianteRecaudo(req.body);
    await nuevoEstudiante.save();
    res.status(201).json({ message: 'Estudiante creado correctamente', estudiante: nuevoEstudiante });
  } catch (error) {
    console.error('Error al crear estudiante:', error);
    res.status(500).json({ message: 'Error al crear estudiante', error });
  }
};

// Listar todos los estudiantes
const listarEstudiantesActaGradoRecaudo = async (req, res) => {
  try {
    const estudiantes = await EstudianteRecaudo.find().sort({ primer_apellido: 1 });
    res.status(200).json(estudiantes);
  } catch (error) {
    console.error('Error al listar estudiantes:', error);
    res.status(500).json({ message: 'Error al listar estudiantes', error });
  }
};

// Buscar estudiante por número de identificación
const buscarPorIdentificacion = async (req, res) => {
  const { num_identificacion } = req.params;

  try {
    const estudiante = await EstudianteRecaudo.findOne({ num_identificacion });
    if (!estudiante) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }
    res.status(200).json(estudiante);
  } catch (error) {
    console.error('Error al buscar estudiante:', error);
    res.status(500).json({ message: 'Error al buscar estudiante', error });
  }
};

module.exports = {
  crearEstudianteActaGradoRecaudo,
  listarEstudiantesActaGradoRecaudo,
  buscarPorIdentificacion,
};
