const express = require('express');
const router = express.Router();
const listaDeGrupos = require('../../controllers/DatosDinamicos/gruposController');

router.get('/', listaDeGrupos.listarGrupos);

// Crear uno
router.post('/', listaDeGrupos.crearGrupo);

// Crear muchos
router.post('/bulk', listaDeGrupos.crearGruposBulk);

module.exports = router;