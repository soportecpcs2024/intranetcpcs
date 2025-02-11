// routes/index.js

const express = require('express');
const router = express.Router();

const reporteController = require('../../controllers/recaudo/reporteController');



// Ruta para exportar el reporte de ventas mensuales a Excel
router.get('/reportes/ventas-mensuales', reporteController.exportarVentasMensuales);

module.exports = router;
