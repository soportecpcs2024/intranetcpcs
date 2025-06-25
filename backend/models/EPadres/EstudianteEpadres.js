// models/Estudiante.js
const mongoose = require('mongoose');

const estudianteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  grupo: { type: String, required: true },
});

module.exports = mongoose.model('Estudiante', estudianteSchema);
