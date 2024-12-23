const Unidad = require('../../models/inventory/unitsModels');

// Crear nuevas unidades (una o múltiples)
exports.crearUnidad = async (req, res) => {
    try {
        const unidades = Array.isArray(req.body) ? req.body : [req.body];

        if (!unidades.length) {
            return res.status(400).json({ error: 'No se proporcionaron unidades para crear.' });
        }

        // Validar los datos antes de insertarlos
        for (const unidad of unidades) {
            if (!unidad.location || unidad.location.trim() === "") {
                delete unidad.location; // Elimina el campo si está vacío
            }
        }

        const nuevasUnidades = await Unidad.insertMany(unidades);
        res.status(201).json({ nuevasUnidades });
    } catch (error) {
        console.error('Error al crear las unidades:', error);
        res.status(500).json({ error: 'Error al crear las unidades' });
    }
};


// Obtener todas las unidades
exports.obtenerUnidades = async (req, res) => {
    try {
        const unidades = await Unidad.find()
            .populate('id_producto')  // Población del producto
            .populate('location');    // Población de la ubicación
        res.status(200).json(unidades);
    } catch (error) {
        console.error('Error al obtener las unidades:', error);
        res.status(500).json({ error: 'Error al obtener las unidades' });
    }
};

// Obtener una unidad por ID
exports.obtenerUnidadPorId = async (req, res) => {
    try {
        const unidad = await Unidad.findById(req.params.id)
            .populate('id_producto')  // Población del producto
            .populate('location');    // Población de la ubicación

        if (!unidad) {
            return res.status(404).json({ error: 'Unidad no encontrada' });
        }
        res.status(200).json(unidad);
    } catch (error) {
        console.error('Error al obtener la unidad:', error);
        res.status(500).json({ error: 'Error al obtener la unidad' });
    }
};

// Actualizar una unidad (solo ciertos campos)
exports.actualizarUnidad = async (req, res) => {
    try {
        const camposActualizados = {
            location: req.body.location,
            estado: req.body.estado,
            entregado_por: req.body.entregado_por,
            recibido_por: req.body.recibido_por,
            fecha_entrega: req.body.fecha_entrega,
            observaciones: req.body.observaciones,
        };

        // Elimina campos vacíos
        Object.keys(camposActualizados).forEach(key => {
            if (camposActualizados[key] === undefined) {
                delete camposActualizados[key];
            }
        });

        const unidadActualizada = await Unidad.findByIdAndUpdate(
            req.params.id,
            { $set: camposActualizados },
            { new: true, runValidators: true }
        )
            .populate('id_producto')  // Población del producto
            .populate('location');    // Población de la ubicación

        if (!unidadActualizada) {
            return res.status(404).json({ error: 'Unidad no encontrada' });
        }
        res.status(200).json(unidadActualizada);
    } catch (error) {
        console.error('Error al actualizar la unidad:', error);
        res.status(500).json({ error: 'Error al actualizar la unidad' });
    }
};

// Eliminar una unidad
exports.eliminarUnidad = async (req, res) => {
    try {
        const unidadEliminada = await Unidad.findByIdAndDelete(req.params.id);
        if (!unidadEliminada) {
            return res.status(404).json({ error: 'Unidad no encontrada' });
        }
        res.status(200).json({ message: 'Unidad eliminada' });
    } catch (error) {
        console.error('Error al eliminar la unidad:', error);
        res.status(500).json({ error: 'Error al eliminar la unidad' });
    }
};

 
