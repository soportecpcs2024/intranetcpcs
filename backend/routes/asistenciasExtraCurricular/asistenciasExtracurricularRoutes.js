const express = require('express');
const router = express.Router();
const {
  obtenerFacturasConAsistencias,
  actualizarAsistenciasFactura
} = require('../../controllers/asistenciasEstraCurricular/asistenciasExtracurricularController');

// GET todas las facturas con asistencias
router.get('/', obtenerFacturasConAsistencias);

// PUT actualizar asistencias por ID de factura
router.put('/:id/asistencias', actualizarAsistenciasFactura);

module.exports = router;
