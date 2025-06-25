const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: String,
  fechaCreacion: { type: Date, default: Date.now },
  fechaLimite: { type: Date, required: true },
  responsable: { type: String, required: true },
  seccion: { type: String, required: true },
  observaciones: String,
  nivelComplejidad: { type: String, enum: ['Baja', 'Media', 'Alta'], required: true },
  estado: { type: String, enum: ['Pendiente', 'Terminado'], default: 'Pendiente' },
   
});

module.exports = mongoose.model('Tarea', tareaSchema);
