const express = require('express');
const router = express.Router();
const studentNSController = require('../controllers/nivelesSuperioresController');

// Ruta para obtener todas las notas de estudiantes
router.get('/', studentNSController.getAllNotesNS);

module.exports = router;
