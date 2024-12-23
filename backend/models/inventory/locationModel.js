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
    required: true,
  },
  recibido_por: {
    type: String,
    default: "Administración",
  },
  email_recibido_por: {
    type: String,
     
  },
  aprobado_por: {
    type: String,
    default: "Administración",
  },
  fecha_entrega: {
    type: Date,  // Date type to handle dates
  },
  fecha_devolucion: {
    type: Date,  // Date type to handle dates
  },
  estado: {
    type: String,
    enum: ["activo", "Inactivo"],  // Enum to restrict values
    default: "Inactivo",  // Default value
    required: true,  // Making it required
  },
}, { timestamps: true });

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
