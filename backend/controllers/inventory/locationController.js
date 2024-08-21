const Location = require('../../models/inventory/locationModel');

// Obtener todas las ubicaciones
const getLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ubicaciones' });
  }
};

// Obtener una ubicación por ID
const getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (location) {
      res.json(location);
    } else {
      res.status(404).json({ error: 'Ubicación no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ubicación' });
  }
};

// Crear una nueva ubicación
const createLocation = async (req, res) => {
  try {
    const { nombre, direccion, otros_detalles } = req.body;
    const newLocation = new Location({ nombre, direccion, otros_detalles });
    const location = await newLocation.save();
    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear ubicación' });
  }
};

// Actualizar una ubicación existente
const updateLocation = async (req, res) => {
  try {
    const { nombre, direccion, otros_detalles } = req.body;
    const location = await Location.findByIdAndUpdate(req.params.id, { nombre, direccion, otros_detalles }, { new: true });
    if (location) {
      res.json(location);
    } else {
      res.status(404).json({ error: 'Ubicación no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar ubicación' });
  }
};

// Eliminar una ubicación
const deleteLocation = async (req, res) => {
  try {
    await Location.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar ubicación' });
  }
};

module.exports = {
  getLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
};
