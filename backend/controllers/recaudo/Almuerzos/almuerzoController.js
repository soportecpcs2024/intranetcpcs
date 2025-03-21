const Almuerzo = require("../../../models/recaudo/Almuerzos/almuerzoModel");

// Crear almuerzo
exports.crearAlmuerzo = async (req, res) => {
  try {
    const almuerzo = new Almuerzo(req.body);
    await almuerzo.save();
    res.status(201).json(almuerzo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todos los almuerzos
exports.obtenerAlmuerzos = async (req, res) => {
  try {
    const almuerzos = await Almuerzo.find();
    res.json(almuerzos);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener un almuerzo por ID
exports.obtenerAlmuerzoPorId = async (req, res) => {
  try {
    const almuerzo = await Almuerzo.findById(req.params.id);
    if (!almuerzo) return res.status(404).json({ message: 'Almuerzo no encontrado' });
    res.json(almuerzo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar un almuerzo por ID
exports.actualizarAlmuerzo = async (req, res) => {
  try {
    const almuerzo = await Almuerzo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!almuerzo) return res.status(404).json({ message: 'Almuerzo no encontrado' });
    res.json(almuerzo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar un almuerzo por ID
exports.eliminarAlmuerzo = async (req, res) => {
  try {
    const almuerzo = await Almuerzo.findByIdAndDelete(req.params.id);
    if (!almuerzo) return res.status(404).json({ message: 'Almuerzo no encontrado' });
    res.json({ message: 'Almuerzo eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
