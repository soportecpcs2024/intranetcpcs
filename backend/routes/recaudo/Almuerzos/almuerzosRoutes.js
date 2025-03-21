const express = require('express');
const router = express.Router();

const almuerzoController = require("../../../controllers/recaudo/Almuerzos/almuerzoController");

// Rutas para Almuerzos
router.post('/', almuerzoController.crearAlmuerzo);        // Crear un almuerzo
router.get('/', almuerzoController.obtenerAlmuerzos);      // Obtener todos los almuerzos
router.get('/almuerzos/:id', almuerzoController.obtenerAlmuerzoPorId); // Obtener un almuerzo por ID
router.put('/almuerzos/:id', almuerzoController.actualizarAlmuerzo);   // Actualizar un almuerzo
router.delete('/almuerzos/:id', almuerzoController.eliminarAlmuerzo);  // Eliminar un almuerzo

module.exports = router;