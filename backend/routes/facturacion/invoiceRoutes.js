// routes/facturacion/invoiceRoutes.js
const express = require('express');
const router = express.Router();
const invoiceController = require('../../controllers/facturacion/invoiceController');

// Crear una nueva factura
router.post('/create', invoiceController.createInvoice);

// Obtener facturas por mes
router.get('/:mes', invoiceController.getInvoicesByMonth);

// Obtener el total de clases por tipo en un mes
router.get('/:mes/total/:nombre', invoiceController.getTotalClassesByType);

// Obtener las facturas de un alumno por mes
router.get('/student/:alumnoId/:mes', invoiceController.getStudentInvoicesByMonth);

// Obtener las clases adquiridas por un alumno en un mes
router.get('/student/classes/:alumnoId/:mes', invoiceController.getStudentInvoicesByMonth);

module.exports = router;
