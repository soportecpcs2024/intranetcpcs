const express = require('express')
const router = express.Router();

const productoPapeleriaController = require('../../controllers/productoPapeleria/productoPapeleriaControllers');

//Rutas para Productos Papeleria
router.post('/',productoPapeleriaController.crearProductoPapeleria) //crear Producto Papeleria
router.get('/',productoPapeleriaController.obtenerProductosPapeleria) // Obtener todas los productos Papeleria
router.get('/:id',productoPapeleriaController.obtenerProductoPapeleriaPorId) //Obtener ProductoPapeleria por ID
router.put('/:id',productoPapeleriaController.actualizarProductosPapeleriaporId) // Actualizar productoPapeleria 
router.delete('/:id',productoPapeleriaController.eliminarProductosPapeleria) // Eliminar productoPapeleria 

module.exports = router