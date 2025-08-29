 
const express = require('express');
const router = express.Router();

const rubricas = require("../../controllers/Rubricas/rubricasController.js")
 
 

 
// POST -> Crear evaluación
router.post("/",rubricas.crearEvaluacion);

// GET -> Todas las evaluaciones
router.get("/", rubricas.obtenerEvaluaciones);

 

module.exports = router;
