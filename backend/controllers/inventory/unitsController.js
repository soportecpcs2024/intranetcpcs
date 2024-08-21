const Unidad = require('../../models/inventory/unitsModels');

// Crear nuevas unidades (una o múltiples)
exports.crearUnidad = async (req, res) => {
    try {
        const unidades = Array.isArray(req.body) ? req.body : [req.body];
        const nuevasUnidades = await Unidad.insertMany(unidades);
        res.status(201).json(nuevasUnidades);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear las unidades' });
    }
};

// Obtener todas las unidades
exports.obtenerUnidades = async (req, res) => {
    try {
        const unidades = await Unidad.find().populate('id_producto');
        res.status(200).json(unidades);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las unidades' });
    }
};

// Obtener una unidad por ID
exports.obtenerUnidadPorId = async (req, res) => {
    try {
        const unidad = await Unidad.findById(req.params.id).populate('id_producto');
        if (!unidad) return res.status(404).json({ error: 'Unidad no encontrada' });
        res.status(200).json(unidad);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la unidad' });
    }
};

// Actualizar una unidad
exports.actualizarUnidad = async (req, res) => {
    try {
        const unidadActualizada = await Unidad.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!unidadActualizada) return res.status(404).json({ error: 'Unidad no encontrada' });
        res.status(200).json(unidadActualizada);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la unidad' });
    }
};

// Eliminar una unidad
exports.eliminarUnidad = async (req, res) => {
    try {
        const unidadEliminada = await Unidad.findByIdAndDelete(req.params.id);
        if (!unidadEliminada) return res.status(404).json({ error: 'Unidad no encontrada' });
        res.status(200).json({ message: 'Unidad eliminada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la unidad' });
    }
};
