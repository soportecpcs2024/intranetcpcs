const Docente = require('../models/docente');

// Obtener todos los docentes
const docente_list = async (req, res) => {
    try {
        const docentes = await Docente.find();
        res.json(docentes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener todos los docentes' });
    }
};

// Obtener un docente por ID
const docente_detail = async (req, res) => {
    const { id } = req.params;
    try {
        const docente = await Docente.findById(id);
        if (!docente) {
            return res.status(404).json({ message: 'Docente no encontrado' });
        }
        res.json(docente);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener el docente por ID' });
    }
};

// Crear un nuevo docente
const docente_create = async (req, res) => {
    const newDocenteData = req.body;
    try {
        const newDocente = new Docente(newDocenteData);
        const savedDocente = await newDocente.save();
        res.status(201).json(savedDocente);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear un nuevo docente' });
    }
};

// Actualizar un docente existente
const docente_update = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const updatedDocente = await Docente.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedDocente) {
            return res.status(404).json({ message: 'Docente no encontrado para actualizar' });
        }
        res.json(updatedDocente);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar el docente' });
    }
};

// Eliminar un docente existente
const docente_delete = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedDocente = await Docente.findByIdAndDelete(id);
        if (!deletedDocente) {
            return res.status(404).json({ message: 'Docente no encontrado para eliminar' });
        }
        res.json({ message: 'Docente eliminado exitosamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar el docente' });
    }
};

// Crear múltiples docentes (carga masiva)
const docente_create_bulk = async (req, res) => {
    const docentes = req.body; // Array de objetos JSON
    try {
        const createdDocentes = await Docente.insertMany(docentes);
        res.status(201).json(createdDocentes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear múltiples docentes' });
    }
};

module.exports = {
    docente_list,
    docente_detail,
    docente_create,
    docente_update,
    docente_delete,
    docente_create_bulk
};
