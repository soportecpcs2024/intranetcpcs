const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  direccion: {
    type: String,
    required: true,
  },
  otros_detalles: {
    type: String,
  },
  entregado_por: {
    type: String,
    default: "",
  },
  recibido_por: {
    type: String,
    default: "Administración",
  },
  aprobado_por: {
    type: String,
    default: "Administración",
  },
  fecha_entrega: {
    type: Date,  // Corregido a Date para manejar fechas
  },
  fecha_devolucion: {
    type: Date,  // Corregido a Date para manejar fechas
  },
}, { timestamps: true });

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
