// controllers/escuelaPadresController.js
const EscuelaPadres = require('../../models/EPadres/EscuelaPadresModel');

// Obtener todas las escuelas
const getEscuelas = async (req, res) => {
  try {
    const escuelas = await EscuelaPadres.find().sort({ createdAt: -1 });
    res.json(escuelas);
  } catch (error) {
    console.error('Error al obtener escuelas:', error);
    res.status(500).json({ message: 'Error al obtener escuelas' });
  }
};

// Crear una nueva escuela
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
    console.error('Error al crear escuela:', error);
    res.status(500).json({ message: 'Error al crear escuela' });
  }
};

module.exports = {
  getEscuelas,
  crearEscuela,
};
