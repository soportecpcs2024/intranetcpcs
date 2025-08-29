const mongoose = require("mongoose");

const respuestaSchema = new mongoose.Schema({
  criterio: { type: String, required: true },
  valor: { type: Number, required: true, enum: [1, 2, 3, 4] },
});

const evaluacionSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  cargo: { type: String, required: true },
  respuestas: [respuestaSchema],
  observaciones: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Evaluacion", evaluacionSchema);
