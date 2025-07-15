const mongoose = require('mongoose');

const estudianteActagradoSchema = new mongoose.Schema({
  cod: { type: Number, required: true, unique: true },
  primer_nombre: { type: String, required: true },
  segundo_nombre: { type: String },
  primer_apellido: { type: String, required: true },
  segundo_apellido: { type: String, required: true },
  identificacion: { type: String, required: true }, // Ej: "Tarjeta de Identidad"
  num_identificacion: { type: String, required: true, unique: true },
  expedicion_docum: { type: String },
  fecha_nacimiento: { type: Date, required: true },
  lugar_nacimiento: { type: String },
  grupo: { type: String },
  grado: { type: String, required: true },
  año_lectivo: { type: Number, required: true },
}, {
  timestamps: true // Agrega campos createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('estudianteActagradoRecaudo', estudianteActagradoSchema);
