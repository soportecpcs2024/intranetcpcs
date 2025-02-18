const mongoose = require('mongoose');

const claseSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  costo: { type: Number, required: true },
  costoDescuento: { type: Number, required: true },
  dia: { type: String},
  hora: { type: String },
});

module.exports = mongoose.model('Clase', claseSchema);
