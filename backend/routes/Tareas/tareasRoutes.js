// routes/tareas.js
const express = require('express');
const router = express.Router();
 const tareascontroller = require('../../controllers/Tareas/tareasController');

 

router.post('/', tareascontroller.crearTarea);
router.get('/', tareascontroller.obtenerTareas);
router.patch('/:id', tareascontroller.actualizarEstadoTarea);
router.delete('/:id', tareascontroller.eliminarTarea);
router.get('/estadisticas', tareascontroller.obtenerEstadisticas);

module.exports = router;
