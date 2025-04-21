const express = require('express');
const router = express.Router();
const studentNotesController = require('../controllers/student_notes_sheet_controller');

// Rutas CRUD con filtro por nivel
router.get('/', studentNotesController.getAllNotesSection); // esta ya incluye el filtro por 'nivel'
router.get('/promedio-materia-grupo', studentNotesController.getPromedioPorMateriaYGrupo); // esta ya incluye el filtro por 'nivel'
 

// Otras rutas
router.get('/:id', studentNotesController.getNoteById);
router.post('/', studentNotesController.createNote);
router.put('/:id', studentNotesController.updateNote);
router.delete('/:id', studentNotesController.deleteNote);

module.exports = router;
