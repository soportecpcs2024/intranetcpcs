const express = require('express');
const router = express.Router();
const  obtenerEstadisticasProductos  = require('../../controllers/inventory/informesController');

// Ruta para obtener las estadísticas de productos
router.get('/estadisticas', obtenerEstadisticasProductos.obtenerEstadisticasPorSubcategoria);

module.exports = router;
