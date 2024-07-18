const express = require('express');
const router = express.Router();
const metasGrupoController = require('../controllers/metasGrupoController');

// Create a new MetasGrupo
router.post('/', metasGrupoController.createMetasGrupo);

// Get all MetasGrupos
router.get('/', metasGrupoController.getAllMetasGrupos);

// Get a MetasGrupo by ID
router.get('/:id', metasGrupoController.getMetasGrupoById);

// Update a MetasGrupo by ID
router.put('/:id', metasGrupoController.updateMetasGrupoById);

// Delete a MetasGrupo by ID
router.delete('/:id', metasGrupoController.deleteMetasGrupoById);

module.exports = router;
