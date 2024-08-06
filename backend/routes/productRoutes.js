const express = require('express');
const multer = require('multer');
const productController = require('../controllers/productController');
const { upload } = require("../utils/fileUpload");
const router = express.Router();

// // Configurar multer para manejar archivos y form-data
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({ storage: storage });

// Ruta para crear un producto
router.post('/', upload.single('image'), productController.createProduct);
router.get("/", productController.getProducts);

module.exports = router;

