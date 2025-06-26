// models/EscuelaPadresModel.js
const mongoose = require('mongoose');

const escuelaPadresSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
  },
  fechas: [
    {
      type: Date,
      required: true,
    }
  ],
  año: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('EscuelaPadres', escuelaPadresSchema);
