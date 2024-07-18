// routes/docenteRoutes.js
const express = require('express');
const router = express.Router();
const docenteController = require('../controllers/docenteController');

// Rutas
router.get('/docentes', docenteController.docente_list);
router.get('/docentes/:id', docenteController.docente_detail);
router.post('/docentes', docenteController.docente_create);
router.put('/docentes/:id', docenteController.docente_update);
router.delete('/docentes/:id', docenteController.docente_delete);

// Ruta para carga masiva de docentes
router.post('/docentes/bulk', docenteController.docente_create_bulk);

module.exports = router;
