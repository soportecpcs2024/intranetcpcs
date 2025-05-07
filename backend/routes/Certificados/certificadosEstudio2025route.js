const express = require('express');
const router = express.Router();
const studentActiveController = require('../../controllers/Certificados/certificadoEstudio2025Controller');

// Ruta para crear un estudiante
router.post('/studentsActive', studentActiveController.saveStudent);

// Ruta para obtener todos los estudiantes
router.get('/studentsActive', studentActiveController.getAllStudents);

// // Ruta para obtener un estudiante por su código de matrícula
// router.get('/studentsActive/:id', studentActiveController.getStudentById);

// Ruta para buscar estudiantes por nombre o número de documento
router.get('/studentsActive/search', studentActiveController.searchStudents);

// Ruta para actualizar un estudiante por su código de matrícula
router.put('/studentsActive/:id', studentActiveController.updateStudent);

// Ruta para eliminar un estudiante por su código de matrícula
router.delete('/studentsActive/:id', studentActiveController.deleteStudent);

module.exports = router;
