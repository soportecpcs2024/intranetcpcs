const express = require('express');
const router = express.Router();
const unitsController = require('../../controllers/inventory/unitsController');

// Ruta para crear nuevas unidades (una o múltiples)
router.post('/', unitsController.crearUnidad);

// Ruta para obtener todas las unidades
router.get('/', unitsController.obtenerUnidades);

// Ruta para obtener una unidad por ID
router.get('/:id', unitsController.obtenerUnidadPorId);

// Ruta para actualizar una unidad por ID
router.put('/:id', unitsController.actualizarUnidad);

// Ruta para eliminar una unidad por ID
router.delete('/:id', unitsController.eliminarUnidad);

 


 

module.exports = router;
