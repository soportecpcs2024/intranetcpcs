const express = require('express');
const router = express.Router();
const studentController = require('../../controllers/facturacion/studentController');

// Rutas CRUD para estudiantes
router.post('/', studentController.createStudent); // Crear estudiante
router.get('/', studentController.getAllStudents); // Obtener todos los estudiantes
router.get('/:id', studentController.getStudentById); // Obtener estudiante por ID
router.put('/:id', studentController.updateStudent); // Actualizar estudiante
router.delete('/:id', studentController.deleteStudent); // Eliminar estudiante

// Agregar clase comprada a un estudiante
router.post('/:id/clases', studentController.addClaseToStudent);

module.exports = router;
