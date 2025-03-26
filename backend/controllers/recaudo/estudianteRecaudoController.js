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

// Obtener todos los estudiantes
exports.obtenerEstudiantes = async (req, res) => {
  try {
    const estudiantes = await Estudiante.find();
    res.json(estudiantes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener estudiantes" });
  }
};

// Buscar estudiantes por coincidencia de nombre
exports.buscarEstudiantes = async (req, res) => {
  try {
    const { nombre } = req.query;
    if (!nombre) return res.json([]); // Si no hay nombre, devolver lista vacía

    const estudiantes = await Estudiante.find({
      nombre: { $regex: nombre, $options: "i" } // Búsqueda flexible (insensible a mayúsculas)
    }).limit(5); // Limitar a 5 resultados

    res.json(estudiantes);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar estudiantes" });
  }
};

// Obtener un estudiante por ID
exports.obtenerEstudiantePorId = async (req, res) => {
  try {
    const estudiante = await Estudiante.findById(req.params.id);
    if (!estudiante) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }
    res.json(estudiante);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el estudiante" });
  }
};

// Actualizar estudiante
exports.actualizarEstudiante = async (req, res) => {
  try {
    const estudiante = await Estudiante.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!estudiante) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }
    res.json(estudiante);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar el estudiante" });
  }
};

// Eliminar estudiante
exports.eliminarEstudiante = async (req, res) => {
  try {
    const estudiante = await Estudiante.findByIdAndDelete(req.params.id);
    if (!estudiante) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }
    res.json({ message: "Estudiante eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el estudiante" });
  }
};