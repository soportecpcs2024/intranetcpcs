const Unidad = require('../../models/inventory/unitsModels');
const QRCode = require('qrcode');

// Crear nuevas unidades (una o múltiples)
exports.crearUnidad = async (req, res) => {
    try {
        const unidades = Array.isArray(req.body) ? req.body : [req.body];
        const nuevasUnidades = [];
        const qrCodes = [];

        for (let unidad of unidades) {
            // Guardar la unidad en la base de datos
            const unidadGuardada = await Unidad.create(unidad);
            
            // Generar el código QR para la unidad
            const qrCodeUrl = await QRCode.toDataURL(`http://localhost:5173/admin/administracion/units/${unidadGuardada._id}`);
             
            console.log({unidadGuardada});
            
            
            // Añadir el código QR al objeto de unidad
            unidadGuardada.qrCode = qrCodeUrl;
            await unidadGuardada.save(); // Guardar los cambios del QR en la base de datos
            nuevasUnidades.push(unidadGuardada);
            qrCodes.push(qrCodeUrl);
        }

        res.status(201).json({ nuevasUnidades, qrCodes });
    } catch (error) {
        console.error('Error al crear las unidades:', error); // Añadir logging para depuración
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
        res.status(500).json({ error: 'Error al obtener las unidades' });
    }
};

// Obtener una unidad por ID
exports.obtenerUnidadPorId = async (req, res) => {
    try {
        const unidad = await Unidad.findById(req.params.id)
            .populate('id_producto')  // Población del producto
            .populate('location');    // Población de la ubicación
        if (!unidad) return res.status(404).json({ error: 'Unidad no encontrada' });
        res.status(200).json(unidad);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la unidad' });
    }
};

// Actualizar una unidad
exports.actualizarUnidad = async (req, res) => {
    try {
        const unidadActualizada = await Unidad.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('id_producto')  // Población del producto
            .populate('location');    // Población de la ubicación
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
