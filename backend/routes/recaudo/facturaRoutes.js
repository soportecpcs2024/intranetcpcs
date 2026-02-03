const express = require('express');
const router = express.Router();
 
const facturaController = require('../../controllers/recaudo/facturaController');
 
// Rutas para Facturas
router.post('/facturas', facturaController.crearFactura);
router.get('/facturas', facturaController.obtenerFacturas);
router.get('/facturas/:id', facturaController.obtenerFacturaPorId);
router.put('/facturas/:id', facturaController.actualizarFactura);
router.delete('/facturas/:id', facturaController.eliminarFactura); // <-- Agregado
router.get("/facturas-completas", facturaController.obtenerFacturasCompletas);
router.get("/facturas/:id/completa", facturaController.obtenerFacturaCompletaPorId);


module.exports = router;
