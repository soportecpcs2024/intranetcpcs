const express = require('express');
const productController = require('../../controllers/inventory/productController');
const { upload } = require('../../utils/fileUpload');

const router = express.Router();

// Ruta para crear un producto
router.post('/', upload.single('image'), productController.createProduct);

// Ruta para actualizar un producto
router.patch('/:id', upload.single('image'), productController.updateProduct);

// Otras rutas
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
