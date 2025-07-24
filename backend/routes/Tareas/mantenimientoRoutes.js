const express = require('express');
const router = express.Router();

 

const mantenimientocontroller =  require('../../controllers/Tareas/mantenimientoController');

// Crear nuevo mantenimiento
router.post('/', mantenimientocontroller.crearMantenimiento);

// Obtener todos los mantenimientos
router.get('/',  mantenimientocontroller.obtenerMantenimientos);

// Actualizar estado (y cumplimiento) de un mantenimiento
router.put('/:id',  mantenimientocontroller.actualizarEstadoMantenimiento);

// Eliminar un mantenimiento
router.delete('/:id',  mantenimientocontroller.eliminarMantenimiento);

module.exports = router;
