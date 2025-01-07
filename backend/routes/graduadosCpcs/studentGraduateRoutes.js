const express = require('express');
const router = express.Router();
const studentGraduateController = require('../../controllers/Graduados/StudentGraduateController');

// Ruta para crear un estudiante
router.post('/studentsGraduate', studentGraduateController.saveStudent);

// Ruta para obtener todos los estudiantes
router.get('/studentsGraduate', studentGraduateController.getAllStudents);

// // Ruta para obtener un estudiante por su código de matrícula
// router.get('/studentsGraduate/:id', studentGraduateController.getStudentById);

// Ruta para buscar estudiantes por nombre o número de documento
router.get('/studentsGraduate/search', studentGraduateController.searchStudents);

// Ruta para actualizar un estudiante por su código de matrícula
router.put('/studentsGraduate/:id', studentGraduateController.updateStudent);

// Ruta para eliminar un estudiante por su código de matrícula
router.delete('/studentsGraduate/:id', studentGraduateController.deleteStudent);

module.exports = router;
