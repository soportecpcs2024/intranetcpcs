const express = require("express");
const router = express.Router();
const {
  crearAsistencia,
  actualizarAsistencia,
  obtenerAsistenciaPorEstudiante,
  asistenciasUnificadas,
  asistenciasUnificadasJSON
} = require("../../controllers/EPadres/asistenciaController");

router.post("/", crearAsistencia);
router.put("/actualizar/:id", actualizarAsistencia);

router.get(
  "/obtener/:escuelaPadresId/:estudianteId",
  obtenerAsistenciaPorEstudiante
);

router.get("/unificada", asistenciasUnificadas);
router.get("/asistencias-unificadas-json", asistenciasUnificadasJSON);

module.exports = router;