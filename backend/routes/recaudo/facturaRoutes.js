// routes/index.js

const express = require('express');
const router = express.Router();
 
const facturaController = require('../../controllers/recaudo/facturaController');
 
// Rutas para Facturas
router.post('/facturas', facturaController.crearFactura);
router.get('/facturas', facturaController.obtenerFacturas);
router.get('/facturas/:id', facturaController.obtenerFacturaPorId);

 

module.exports = router;
