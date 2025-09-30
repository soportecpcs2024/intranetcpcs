const AdmisionesEstudiante = require("../../models/admisiones/admisiones");

// 📌 Crear nuevo estudiante
const crearEstudiante = async (req, res) => {
  try {
    const nuevoEstudiante = new AdmisionesEstudiante(req.body);
    await nuevoEstudiante.save();
    res.status(201).json(nuevoEstudiante);
  } catch (error) {
    res.status(400).json({ message: "Error al crear estudiante", error });
  }
};

// 📌 Obtener todos los estudiantes
const obtenerEstudiantes = async (req, res) => {
  try {
    const estudiantes = await AdmisionesEstudiante.find().sort({ createdAt: -1 });
    res.status(200).json(estudiantes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener estudiantes", error });
  }
};

// 📌 Obtener estudiante por ID de Mongo
const obtenerEstudiantePorId = async (req, res) => {
  try {
    const estudiante = await AdmisionesEstudiante.findById(req.params.id);
    if (!estudiante) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }
    res.status(200).json(estudiante);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener estudiante", error });
  }
};

// 📌 Actualizar estudiante por ID
const actualizarEstudiante = async (req, res) => {
  try {
    const estudianteActualizado = await AdmisionesEstudiante.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!estudianteActualizado) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }
    res.status(200).json(estudianteActualizado);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar estudiante", error });
  }
};

// 📌 Eliminar estudiante por ID
const eliminarEstudiante = async (req, res) => {
  try {
    const estudianteEliminado = await AdmisionesEstudiante.findByIdAndDelete(req.params.id);
    if (!estudianteEliminado) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }
    res.status(200).json({ message: "Estudiante eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar estudiante", error });
  }
};

module.exports = {
  crearEstudiante,
  obtenerEstudiantes,
  obtenerEstudiantePorId,
  actualizarEstudiante,
  eliminarEstudiante,
};
