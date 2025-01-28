const express = require('express');
const { createClase, getClases, updateClase, deleteClase } = require('../../controllers/facturacion/claseController');

const router = express.Router();

router.post('/', createClase);
router.get('/', getClases);
router.put('/:id', updateClase);
router.delete('/:id', deleteClase);

module.exports = router;
