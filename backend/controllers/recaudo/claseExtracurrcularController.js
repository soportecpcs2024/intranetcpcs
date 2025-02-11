const Clase = require('../../models/recaudo/ClaseExtracurricular');

// Crear clase
exports.crearClase = async (req, res) => {
  try {
    const clase = new Clase(req.body);
    await clase.save();
    res.status(201).json(clase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todas las clases
exports.obtenerClases = async (req, res) => {
  try {
    const clases = await Clase.find();
    res.json(clases);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener una clase por ID
exports.obtenerClasePorId = async (req, res) => {
  try {
    const clase = await Clase.findById(req.params.id);
    if (!clase) return res.status(404).json({ message: 'Clase no encontrada' });
    res.json(clase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar una clase por ID
exports.actualizarClase = async (req, res) => {
  try {
    const clase = await Clase.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!clase) return res.status(404).json({ message: 'Clase no encontrada' });
    res.json(clase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar una clase por ID
exports.eliminarClase = async (req, res) => {
  try {
    const clase = await Clase.findByIdAndDelete(req.params.id);
    if (!clase) return res.status(404).json({ message: 'Clase no encontrada' });
    res.json({ message: 'Clase eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
