const mongoose = require('mongoose');

const escuelaPadresSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  grupo: { type: String, required: true }, // ej: "SEGUNDO C"
  fechas: [{ type: Date, required: true }] // mínimo 3, máximo 9
});

module.exports = mongoose.model('EscuelaPadres', escuelaPadresSchema);
