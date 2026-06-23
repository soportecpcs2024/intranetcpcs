const express = require('express');
const router = express.Router();

const historicoController = require('../../../controllers/EPadres/Historico/historicoController');

// Crear registro
router.post('/', historicoController.createHistorico);

// Obtener todos los registros
router.get('/', historicoController.getHistoricos);

// Buscar por documento
router.get(
  '/documento/:documento',
  historicoController.getHistoricoByDocumento
);

// Buscar por periodo, ejemplo: 2026-A
router.get(
  '/periodo/:periodo',
  historicoController.getHistoricoByPeriodo
);

// Actualizar registro
router.put('/:id', historicoController.updateHistorico);

// Eliminar registro
router.delete('/:id', historicoController.deleteHistorico);

module.exports = router;