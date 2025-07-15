const express = require('express');
const router = express.Router();
const estudiantesActaGradocontroller =  require('../../../controllers/Certificados/ActasDeGrado/actasDegradocontroller');

router.post('/', estudiantesActaGradocontroller.crearEstudianteActaGradoRecaudo);
router.get('/', estudiantesActaGradocontroller.listarEstudiantesActaGradoRecaudo);
router.get('/:num_identificacion', estudiantesActaGradocontroller.buscarPorIdentificacion);

module.exports = router;
