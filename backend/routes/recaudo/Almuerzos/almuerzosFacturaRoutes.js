const express = require('express');
const router = express.Router();

const facturaAlmuerzoController = require('../../../controllers/recaudo/Almuerzos/facturaAlmuerzoController');

// Rutas para Factura de Almuerzos
router.post('/', facturaAlmuerzoController.crearFactura);        // Crear una factura
router.get('/', facturaAlmuerzoController.obtenerFacturas);      // Obtener todas las facturas
router.get('/facturas/:id', facturaAlmuerzoController.obtenerFacturaPorId); // Obtener una factura por ID
router.delete('/facturas/:id', facturaAlmuerzoController.eliminarFactura);  // Eliminar una factura

module.exports = router;
