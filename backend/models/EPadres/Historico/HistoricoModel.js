const mongoose = require('mongoose');

const historicoSchema = new mongoose.Schema(
  {
    estudiante: {
      nombre: {
        type: String,
        required: true,
        trim: true,
      },
      documento: {
        type: String,
        required: true,
        trim: true,
      },
      grupo: {
        type: String,
        required: true,
        trim: true,
      },
    },

    escuela: {
      nombre: {
        type: String,
        required: true,
        trim: true,
      },
    },

    asistencias_resumen: {
      type: String,
      required: true,
      trim: true,
    },

    certificadoOtorgado: {
      type: Boolean,
      default: false,
    },

    año: {
      type: String,
      required: true,
      trim: true,
      match: /^\d{4}-[AB]$/,
    },
  },
  {
    timestamps: true,
    collection: 'historico',
  }
);

historicoSchema.index(
  {
    'estudiante.documento': 1,
    'escuela.nombre': 1,
    año: 1,
  },
  { unique: true }
);

module.exports = mongoose.model(
  'Historico',
  historicoSchema
);