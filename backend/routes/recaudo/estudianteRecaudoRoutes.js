// routes/index.js

const express = require('express');
const router = express.Router();
const estudianteController = require('../../controllers/recaudo/estudianteRecaudoController');
 

// Rutas para Estudiantes
router.post('/estudiantes', estudianteController.crearEstudiante);
router.get('/estudiantes/:nombre', estudianteController.buscarEstudiante);
 

module.exports = router;
