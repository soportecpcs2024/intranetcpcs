const Mantenimiento = require('../../models/Tareas/mantenimiento.jsx');

// Crear mantenimiento
const crearMantenimiento = async (req, res) => {
  try {
    // console.log("📥 Datos recibidos:", req.body);

    const nuevoMantenimiento = new Mantenimiento(req.body);
    await nuevoMantenimiento.save();

    res.status(201).json(nuevoMantenimiento);
  } catch (error) {
    console.error("❌ Error al crear mantenimiento:", error.message);
    console.error("🧾 Detalles:", error);
    res.status(500).json({ mensaje: 'Error al crear mantenimiento', error: error.message });
  }
};



// Obtener todos los mantenimientos
const obtenerMantenimientos = async (req, res) => {
  try {
    const mantenimientos = await Mantenimiento.find();
    res.json(mantenimientos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener mantenimientos', error });
  }
};

// Actualizar mantenimiento (usado por PATCH en frontend)
const actualizarEstadoMantenimiento = async (req, res) => {
  try {
    const mantenimiento = await Mantenimiento.findById(req.params.id);
    if (!mantenimiento) {
      return res.status(404).json({ mensaje: 'Mantenimiento no encontrado' });
    }

    if (req.body.estado === 'Terminado') {
      req.body.fechaRealizacion = new Date();

      const fechaProgramada = new Date(mantenimiento.fechaProgramada);
      const fechaRealizacion = new Date(req.body.fechaRealizacion);

      req.body.cumplimiento =
        fechaRealizacion <= fechaProgramada ? 'Eficiente' : 'Tardío';
    }

    const mantenimientoActualizado = await Mantenimiento.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(mantenimientoActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar mantenimiento', error });
  }
};

// Eliminar mantenimiento
const eliminarMantenimiento = async (req, res) => {
  try {
    await Mantenimiento.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Mantenimiento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar mantenimiento', error });
  }
};

module.exports = {
  crearMantenimiento,
  obtenerMantenimientos,
  actualizarEstadoMantenimiento,
  eliminarMantenimiento,
};
