const express = require('express');
const router = express.Router();
const {
  crearEstudiante,
  getEstudiantes,
  buscarEstudiante
} = require('../../controllers/EPadres/estudianteController');

// Crear nuevo estudiante
router.post('/', crearEstudiante);

// Obtener todos los estudiantes (opcional)
router.get('/', getEstudiantes);

// Buscar estudiante por nombre o identificación
router.get('/buscar', buscarEstudiante);

module.exports = router;
