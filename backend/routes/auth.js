const express = require("express");
const AuthController = require("../controllers/auth");

const router = express.Router();

router.post("/register", AuthController.register); // Ruta para el registro
router.post("/login", AuthController.login); // Ruta para el inicio de sesión
router.post("/refresh_access_token", AuthController.refreshAccessToken); // Ruta para actualizar el token

module.exports = router;
