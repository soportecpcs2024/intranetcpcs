// controllers/evaluacionController.js
import Evaluacion from "../../models/Rubricas/rubricasModel.js"

// Crear nueva evaluación
export const crearEvaluacion = async (req, res) => {
  try {
      const { nombre, cargo, respuestas = {}, observaciones = "" } = req.body;

    const nuevaEvaluacion = new Evaluacion({
    nombre,
      cargo,
      respuestas: respuestas.autoevaluacion || [], // ⬅️ solo el array de autoevaluación
      observaciones,
    });

    await nuevaEvaluacion.save();
    res.status(201).json({ message: "Evaluación guardada con éxito", evaluacion: nuevaEvaluacion });
  } catch (error) {
    res.status(500).json({ message: "Error al guardar la evaluación", error: error.message });
  }
};

// Obtener todas las evaluaciones
export const obtenerEvaluaciones = async (req, res) => {
  try {
    const evaluaciones = await Evaluacion.find();
    res.json(evaluaciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener evaluaciones", error: error.message });
  }
};

 
 