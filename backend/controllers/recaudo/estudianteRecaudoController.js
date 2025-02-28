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
