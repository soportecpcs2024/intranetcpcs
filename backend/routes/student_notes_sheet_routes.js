const express = require('express');
const router = express.Router();
const studentNotesController = require('../controllers/student_notes_sheet_controller');

// Rutas CRUD
router.get('/', studentNotesController.getAllNotes);
router.get('/:id', studentNotesController.getNoteById);
router.post('/', studentNotesController.createNote);
router.put('/:id', studentNotesController.updateNote);
router.delete('/:id', studentNotesController.deleteNote);

module.exports = router;
