const express = require('express');
const router = express.Router();
const {
  inicializarAsistencia,
  actualizarAsistencia,
  obtenerAsistenciasPorEscuela,
  obtenerAsistenciaPorEstudiante
} = require('../../controllers/asistenciasPadresController');

// Inicializar asistencia de todos los estudiantes para una escuela
router.post('/init/:escuelaId', inicializarAsistencia);

// Actualizar asistencia individual por fecha
router.patch('/:id', actualizarAsistencia);

// Obtener todos los registros de asistencia por escuela
router.get('/escuela/:escuelaId', obtenerAsistenciasPorEscuela);

// Obtener un registro de asistencia por estudiante
router.get('/estudiante/:estudianteId', obtenerAsistenciaPorEstudiante);

module.exports = router;
