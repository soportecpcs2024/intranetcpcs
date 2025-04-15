const express = require('express');
const router = express.Router();
const estudianteController = require('../../controllers/recaudo/estudianteRecaudoController');

// Rutas para Estudiantes
router.post('/estudiantes', estudianteController.crearEstudiante);

// Buscar estudiantes por nombre (consulta en tiempo real)
router.get('/estudiantes//buscar', estudianteController.buscarEstudiantes);
// Buscar estudiantes por nombre (consulta en tiempo real)
router.get('/estudiantes', estudianteController.obtenerEstudiantes);

module.exports = router;
