const express = require("express");
const router = express.Router();

const upload = require("../../middlewares/uploadExcel");
const nominaController = require("../../controllers/contabilidad/nominaController");

// POST: subir y procesar Excel
router.post("/upload", upload.single("file"), nominaController.uploadNomina);

// GET: buscar por cédula + fecha
// Ej: /api/nomina/by-cedula-fecha/1034929374?fecha=2026-01-30
router.get("/by-cedula-fecha/:cedula", nominaController.getByCedulaFecha);
router.get("/by-cedula/:cedula", nominaController.getByCedula);
router.delete("/by-fecha", nominaController.deleteByFecha);




module.exports = router;
