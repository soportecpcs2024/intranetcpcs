const express = require("express");
const router = express.Router();
const admisionesEstudianteController = require("../../controllers/admisiones/admisionesEstudianteController");

// Ruta para obtener todos los estudiantes
router.get("/", admisionesEstudianteController.obtenerEstudiantes);

// Ruta para obtener un estudiante por ID
router.get("/:id", admisionesEstudianteController.obtenerEstudiantePorId);

// Ruta para crear un nuevo estudiante
router.post("/", admisionesEstudianteController.crearEstudiante);

// Ruta para actualizar un estudiante por ID
router.put("/:id", admisionesEstudianteController.actualizarEstudiante);

// Ruta para eliminar un estudiante por ID
router.delete("/:id", admisionesEstudianteController.eliminarEstudiante);

module.exports = router;
