// controllers/evaluacionController.js
const Evaluacion = require("../../models/Rubricas/rubricasModel.js");

// Crear nueva evaluación
const crearEvaluacion = async (req, res) => {
  try {
    const { nombre, cargo, respuestas = {}, observaciones = "" } = req.body;

    const nuevaEvaluacion = new Evaluacion({
      nombre,
      cargo,
      respuestas: respuestas.autoevaluacion || [], // solo el array de autoevaluación
      observaciones,
    });

    await nuevaEvaluacion.save();
    res.status(201).json({ message: "Evaluación guardada con éxito", evaluacion: nuevaEvaluacion });
  } catch (error) {
    res.status(500).json({ message: "Error al guardar la evaluación", error: error.message });
  }
};

// Obtener todas las evaluaciones
const obtenerEvaluaciones = async (req, res) => {
  try {
    const evaluaciones = await Evaluacion.find();
    res.json(evaluaciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener evaluaciones", error: error.message });
  }
};

// Exportar las funciones para las rutas
module.exports = {
  crearEvaluacion,
  obtenerEvaluaciones,
};
