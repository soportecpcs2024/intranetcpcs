const express = require('express');
const router = express.Router();
const asistenciaEstudiantesController = require ('../../controllers/AsistenciaEstudiantes/asistenciaEstudiantesController.js'); 

router.get('/', asistenciaEstudiantesController.mostrarListaGrupo)
router.post('/', asistenciaEstudiantesController.guardarAsistenciaDiaria)

module.exports = router;