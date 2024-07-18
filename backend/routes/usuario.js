const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Ruta para obtener todos los usuarios
router.get('/', usuarioController.obtenerUsuarios);

// Ruta para obtener un usuario por ID
router.get('/:id', usuarioController.obtenerUsuarioPorId);

// Ruta para crear uno o más usuarios
router.post('/', usuarioController.crearUsuario);

// Ruta para actualizar un usuario por ID
router.put('/:id', usuarioController.actualizarUsuario);

// Ruta para eliminar un usuario por ID
router.delete('/:id', usuarioController.eliminarUsuario);

module.exports = router;
