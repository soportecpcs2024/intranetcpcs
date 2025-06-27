const EscuelaPadres = require('../../models/EPadres/EscuelaPadresModel');

// 📥 Obtener todas las escuelas
const getEscuelas = async (req, res) => {
  try {
    const escuelas = await EscuelaPadres.find().sort({ createdAt: -1 });
    res.json(escuelas);
  } catch (error) {
    console.error('❌ Error al obtener escuelas:', error);
    res.status(500).json({ message: 'Error al obtener escuelas' });
  }
};

// ✅ Crear una nueva escuela
const crearEscuela = async (req, res) => {
  try {
    const { nombre, descripcion, fechas, año } = req.body;

    if (!nombre || !fechas || fechas.length === 0 || !año) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }

    const nuevaEscuela = new EscuelaPadres({
      nombre,
      descripcion,
      fechas,
      año,
    });

    await nuevaEscuela.save();
    res.status(201).json({ message: 'Escuela creada correctamente', escuela: nuevaEscuela });
  } catch (error) {
    console.error('❌ Error al crear escuela:', error);
    res.status(500).json({ message: 'Error al crear escuela' });
  }
};

// 📝 Actualizar una escuela existente
const actualizarEscuela = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, fechas, año } = req.body;

  try {
    const escuela = await EscuelaPadres.findById(id);
    if (!escuela) {
      return res.status(404).json({ message: 'Escuela no encontrada' });
    }

    escuela.nombre = nombre || escuela.nombre;
    escuela.descripcion = descripcion || escuela.descripcion;
    escuela.fechas = fechas || escuela.fechas;
    escuela.año = año || escuela.año;

    await escuela.save();
    res.json({ message: 'Escuela actualizada correctamente', escuela });
  } catch (error) {
    console.error('❌ Error al actualizar escuela:', error);
    res.status(500).json({ message: 'Error al actualizar escuela' });
  }
};

// 🗑️ Eliminar una escuela
const eliminarEscuela = async (req, res) => {
  const { id } = req.params;

  try {
    const escuela = await EscuelaPadres.findById(id);
    if (!escuela) {
      return res.status(404).json({ message: 'Escuela no encontrada' });
    }

    await escuela.deleteOne();
    res.json({ message: 'Escuela eliminada correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar escuela:', error);
    res.status(500).json({ message: 'Error al eliminar escuela' });
  }
};

module.exports = {
  getEscuelas,
  crearEscuela,
  actualizarEscuela,
  eliminarEscuela,
};
