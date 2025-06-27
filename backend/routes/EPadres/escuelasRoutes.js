// routes/escuelas.js
const express = require('express');
const router = express.Router();
const escuelaController = require('../../controllers/EPadres/escuelaPadresController');

// Listar todas las escuelas
router.get('/', escuelaController.getEscuelas);

// Crear una nueva escuela
router.post('/', escuelaController.crearEscuela);

// PUT actualizar escuela
router.put('/:id',escuelaController.actualizarEscuela);

// DELETE eliminar escuela
router.delete('/:id', escuelaController.eliminarEscuela);

module.exports = router;
