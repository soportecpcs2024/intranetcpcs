const express = require('express');
const asistenciasDataController = require('../../controllers/registroAsistenciaController/registroAsisitenciaController');

const router = express.Router();

router.get('/', asistenciasDataController.obtenerAsistencias);

module.exports = router;