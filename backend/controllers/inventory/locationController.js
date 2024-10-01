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
    const { nombre, direccion, otros_detalles, entregado_por, recibido_por, aprobado_por, estado } = req.body;

    // Verifica si ya existe una ubicación con el mismo nombre
    const existingLocation = await Location.findOne({ nombre: nombre.trim(), direccion: direccion.trim(), });

    if (existingLocation) {
      return res.status(400).json({ error: 'Ya existe una ubicación con este nombre.' });
    }

    // Crea una nueva instancia de Location con los datos proporcionados
    const newLocation = new Location({
      nombre,
      direccion,
      otros_detalles,
      entregado_por,
      recibido_por,
      aprobado_por,
      estado,
    });

    const location = await newLocation.save();
    res.status(201).json(location);
  } catch (error) {
    console.error('Error al crear ubicación:', error); // Log de error para depuración
    res.status(500).json({ error: 'Error al crear ubicación.' });
  }
};

// Actualizar una ubicación existente
const updateLocation = async (req, res) => {
  try {
    const { nombre, direccion, otros_detalles, entregado_por, recibido_por, aprobado_por, estado } = req.body;

    // Actualiza la ubicación existente con los nuevos datos
    const location = await Location.findByIdAndUpdate(
      req.params.id,
      {
        nombre,
        direccion,
        otros_detalles,
        entregado_por,
        recibido_por,
        aprobado_por,
        estado,
      },
      { new: true } // Opciones para devolver el documento actualizado
    );

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