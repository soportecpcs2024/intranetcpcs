const Student = require('../../models/facturacion/Student');

// Crear estudiante
exports.createStudent = async (req, res) => {
    try {
        const { nombre, numIdentificacion } = req.body;

        const student = new Student({ nombre, numIdentificacion });
        await student.save();

        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Obtener todos los estudiantes
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().populate('clasesCompradas.claseId');
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener estudiante por ID
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('clasesCompradas.claseId');
        if (!student) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar estudiante
exports.updateStudent = async (req, res) => {
    try {
        const { nombre, numIdentificacion } = req.body;
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { nombre, numIdentificacion },
            { new: true }
        );
        if (!student) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar estudiante
exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }
        res.status(200).json({ message: 'Estudiante eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Agregar clase comprada al estudiante
exports.addClaseToStudent = async (req, res) => {
    try {
        const { claseId, mes, costo } = req.body;

        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }

        student.clasesCompradas.push({ claseId, mes, costo });
        await student.save();

        res.status(200).json(student);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
