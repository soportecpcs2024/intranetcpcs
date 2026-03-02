// routes/checkupRoutes.js

const express = require('express');
const router = express.Router();

const checkupController = require('../../../controllers/planMejoramientoSecciones/Plancontrollers/checkupController');

// IMPORTA tu middleware protect (ajusta la ruta según tu proyecto)
const { asureAuth } = require('../../../middlewares/authenticated');

/*
=========================================
PLAN DE MEJORAMIENTO (MULTI-AÑO)
=========================================
*/

// Crear plan (recomendado: protegido)
router.post('/checkups/plan', asureAuth, checkupController.createPlan);

// Obtener plan activo (protegido)
router.get('/checkups/plan-activo', asureAuth, checkupController.getActivePlan);


/*
=========================================
BANCO DE PREGUNTAS
=========================================
*/

// Obtener preguntas por área y periodo (protegido)
router.get('/checkups/preguntas', asureAuth, checkupController.getQuestions);


/*
=========================================
CHEQUEO SEMANAL
=========================================
*/

// Crear o actualizar chequeo semanal (protegido)
router.post('/checkups/semanal', asureAuth, checkupController.upsertWeeklyCheckup);

// Obtener historial de chequeos (protegido)
router.get('/checkups/semanal', asureAuth, checkupController.listWeeklyCheckups);


/*
=========================================
DASHBOARD ESTADISTICAS
=========================================
*/

// Estadísticas generales (protegido)
router.get('/checkups/dashboard', asureAuth, checkupController.dashboardStats);

module.exports = router;