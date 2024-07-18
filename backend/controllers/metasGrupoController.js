const MetasGrupo = require('../models/metasGrupo');

// Create a new MetasGrupo
exports.createMetasGrupo = async (req, res) => {
  try {
    const { grupo, periodo } = req.body;

    // Check if a MetasGrupo for the given group and period already exists
    const existingMetasGrupo = await MetasGrupo.findOne({ grupo, periodo });
    if (existingMetasGrupo) {
      return res.status(400).json({ message: `Ya existe un registro para el grupo ${grupo} en el periodo ${periodo}` });
    }

    const newMetasGrupo = new MetasGrupo(req.body);
    const savedMetasGrupo = await newMetasGrupo.save();
    res.status(201).json(savedMetasGrupo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all MetasGrupos
exports.getAllMetasGrupos = async (req, res) => {
  try {
    const metasGrupos = await MetasGrupo.find();
    res.status(200).json(metasGrupos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a MetasGrupo by ID
exports.getMetasGrupoById = async (req, res) => {
  try {
    const metasGrupo = await MetasGrupo.findById(req.params.id);
    if (!metasGrupo) {
      return res.status(404).json({ message: 'MetasGrupo not found' });
    }
    res.status(200).json(metasGrupo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a MetasGrupo by ID
exports.updateMetasGrupoById = async (req, res) => {
  try {
    const updatedMetasGrupo = await MetasGrupo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedMetasGrupo) {
      return res.status(404).json({ message: 'MetasGrupo not found' });
    }
    res.status(200).json(updatedMetasGrupo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a MetasGrupo by ID
exports.deleteMetasGrupoById = async (req, res) => {
  try {
    const deletedMetasGrupo = await MetasGrupo.findByIdAndDelete(req.params.id);
    if (!deletedMetasGrupo) {
      return res.status(404).json({ message: 'MetasGrupo not found' });
    }
    res.status(200).json({ message: 'MetasGrupo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
