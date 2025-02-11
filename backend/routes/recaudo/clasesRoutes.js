const express = require('express');
const router = express.Router();

const claseController = require('../../controllers/recaudo/claseExtracurrcularController');

// Rutas para Clases Extracurriculares
router.post('/clases', claseController.crearClase);        // Crear una clase
router.get('/clases', claseController.obtenerClases);      // Obtener todas las clases
router.get('/clases/:id', claseController.obtenerClasePorId); // Obtener una clase por ID
router.put('/clases/:id', claseController.actualizarClase);   // Actualizar una clase
router.delete('/clases/:id', claseController.eliminarClase);  // Eliminar una clase

module.exports = router;
