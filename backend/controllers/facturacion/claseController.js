const Clase = require('../../models/facturacion/Clase');

// Crear una nueva clase
const createClase = async (req, res) => {
    const { nombre, docente, costo, horario } = req.body;

    try {
        const nuevaClase = new Clase({ nombre, docente, costo, horario });
        await nuevaClase.save();
        res.status(201).json(nuevaClase);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Obtener todas las clases
const getClases = async (req, res) => {
    try {
        const clases = await Clase.find();
        res.json(clases);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Actualizar una clase
const updateClase = async (req, res) => {
    const { id } = req.params;
    const { nombre, docente, costo, horario } = req.body;

    try {
        const claseActualizada = await Clase.findByIdAndUpdate(id, { nombre, docente, costo, horario }, { new: true });
        res.json(claseActualizada);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Eliminar una clase
const deleteClase = async (req, res) => {
    const { id } = req.params;

    try {
        await Clase.findByIdAndDelete(id);
        res.json({ message: 'Clase eliminada con éxito.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createClase,
    getClases,
    updateClase,
    deleteClase,
};
