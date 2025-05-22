const express = require('express');
const router = express.Router();
const planController = require('../../controllers/planMejoramientoSecciones/planMejoramientoSeccionesController');

// Crear un nuevo plan de mejoramiento
router.post('/', planController.crearPlan);

// Obtener todos los planes
router.get('/', planController.obtenerPlanes);

// Obtener un plan por ID
router.get('/:id', planController.obtenerPlanPorId);

// Actualizar un plan por ID
router.put('/:id', planController.actualizarPlan);

// Eliminar un plan por ID
router.delete('/:id', planController.eliminarPlan);

// Actualizar un plan por sección y período
router.put('/buscar-por-seccion-periodo', planController.actualizarPlanPorSeccionYPeriodo);

module.exports = router;
