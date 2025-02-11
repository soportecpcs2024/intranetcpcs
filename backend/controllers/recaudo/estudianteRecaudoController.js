const Estudiante = require('../../models/recaudo/EstudianteRecaudo');

// Crear estudiante
exports.crearEstudiante = async (req, res) => {
  try {
    const estudiante = new Estudiante(req.body);
    await estudiante.save();
    res.status(201).json(estudiante);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Buscar estudiante por documento de identidad
exports.buscarEstudiante = async (req, res) => {
  try {
    const estudiante = await Estudiante.findOne({ nombre: req.params.nombre });
    if (!estudiante) return res.status(404).json({ message: 'Estudiante no encontrado' });
    res.json(estudiante);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
