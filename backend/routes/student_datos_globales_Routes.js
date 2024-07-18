// routes/studentRoutes.js
const express = require('express');
const studentDataController = require('../controllers/student_datos_globales_Controller');

const router = express.Router();

router.post('/', studentDataController.createStudent);
router.get('/', studentDataController.getStudents);
router.get('/:id', studentDataController.getStudent);
router.patch('/:id', studentDataController.updateStudent);
router.delete('/:id', studentDataController.deleteStudent);

module.exports = router;
