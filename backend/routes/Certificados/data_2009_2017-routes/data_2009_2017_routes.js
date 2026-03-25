const express = require('express');
const router = express.Router();
const data_2009_2017_Controller = require('../../../controllers/Certificados/data_2009_2017/data_2009_2017_controller');

router.post('/2009_2017_estudiantes', data_2009_2017_Controller.crearEstudiante);
router.get('/2009_2017_estudiantes/:id', data_2009_2017_Controller.obtenerPorIdentificacion);

module.exports = router;