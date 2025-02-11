const mongoose = require('mongoose');

const claseSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  costo: { type: Number, required: true },
  dia: { type: String, required: true },
  hora: { type: String, required: true },
});

module.exports = mongoose.model('Clase', claseSchema);
