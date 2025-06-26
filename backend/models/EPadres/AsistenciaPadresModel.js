// models/AsistenciaPadresModel.js
const mongoose = require('mongoose');

const asistenciaSchema = new mongoose.Schema({
  estudianteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EstudianteEPadres', // Asegúrate que el nombre coincida
    required: true,
  },
  escuelaPadresId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EscuelaPadres',
    required: true,
  },
  asistencias: [
    {
      fecha: {
        type: Date,
        required: true,
      },
      asistio: {
        type: Boolean,
        default: false,
      }
    }
  ],
  entregaMaterial: {
    type: Boolean,
    default: false,
  },
  tieneHermano: {
    type: Boolean,
    default: false,
  },
  certificadoOtorgado: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('AsistenciaPadres', asistenciaSchema);
