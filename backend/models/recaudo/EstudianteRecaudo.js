const mongoose = require('mongoose');

const estudianteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  documentoIdentidad: { type: String, required: true, unique: true },
  grado: { type: String, required: true },
});

module.exports = mongoose.model('EstudianteRecaudo', estudianteSchema);
