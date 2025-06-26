// routes/asistenciaRoutes.js
const express = require("express");
const router = express.Router();
const {
  crearAsistencia,
  actualizarAsistencia,
  obtenerAsistenciaPorEstudiante,
} = require("../../controllers/EPadres/asistenciaController");

// Crear un nuevo registro de asistencia
router.post("/", crearAsistencia);

// Actualizar un registro de asistencia
router.put("/actualizar/:id", actualizarAsistencia);

// Obtener la asistencia de un estudiante en una escuela específica
router.get(
  "/obtener/:escuelaPadresId/:estudianteId",
  obtenerAsistenciaPorEstudiante
);

module.exports = router;
