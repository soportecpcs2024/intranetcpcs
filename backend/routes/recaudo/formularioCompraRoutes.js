const express = require('express');
const router = express.Router();
const formularioCompracontroller = require('../../controllers/recaudo/formularioCompraController');

// POST - Crear
router.post('/',formularioCompracontroller.crearFormulario);

// GET - Todos
router.get('/', formularioCompracontroller.obtenerFormularios);

// GET - Uno
router.get('/:id', formularioCompracontroller.obtenerFormularioPorId);

// PUT - Actualizar
router.put('/:id', formularioCompracontroller.actualizarFormulario);

// DELETE - Eliminar
router.delete('/:id', formularioCompracontroller.eliminarFormulario);

module.exports = router;
