// routes/llegadasTardesRoutes.js
const express = require('express');
const router = express.Router();
const llegadasTardesController = require('../controllers/llegadasTardesController');

// Agregar fechas de llegadas tarde para un usuario
router.post('/', llegadasTardesController.addLlegadasTardes);

// Obtener todas las llegadas tardes junto con la información del usuario
router.get('/', llegadasTardesController.getAllLlegadasTardes);

// Obtener una llegada tarde por ID
router.get('/:id', llegadasTardesController.getLlegadaTardeById);

// Actualizar las fechas de llegadas tarde para un usuario
router.put('/:id', llegadasTardesController.updateLlegadaTarde);

// Eliminar una llegada tarde
router.delete('/:id', llegadasTardesController.deleteLlegadaTarde);

module.exports = router;
