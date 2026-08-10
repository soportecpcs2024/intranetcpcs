const mongoose = require("mongoose");

const asistenciaEstudianteSchema = new mongoose.Schema(
  {
    estudianteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EstudianteRecaudo",
      required: true,
      index: true,
    },
    grupo:{
      type: String,
      required: true,
    },
    fecha: {
      type: Date,
      required: true,
    },

    estado: {
      type: String,
      enum: ["ASISTIO", "LLEGADA_TARDE", "FALTO"],
      default: "ASISTIO",
      required: true,
    },

    observacion: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

asistenciaEstudianteSchema.index(
  {
    estudianteId: 1,
    fecha: 1,
  },
  {
    unique: true,
  }
);
asistenciaEstudianteSchema.index(
  { grupo: 1, fecha: 1 }
);

module.exports = mongoose.model(
  "AsistenciaEstudiante",
  asistenciaEstudianteSchema
);