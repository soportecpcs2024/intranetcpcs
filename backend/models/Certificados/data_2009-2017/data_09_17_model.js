const mongoose = require('mongoose');

const materiaSchema = new mongoose.Schema(
  {
    NombreArea: { type: String, required: true, trim: true },
    conceptoNum: { type: Number, required: true },
    NombreConcepto: { type: String, required: true, trim: true },
    Intensidad: { type: Number, required: true },
    HorasAno: { type: Number, required: true },
    HorasDictadas: { type: Number, required: true },
    faltas: { type: Number, required: true, default: 0 },
    FechaRetiro: { type: String, default: '', trim: true },
    Escala_valorativa: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const data_2009_2017_Schema = new mongoose.Schema(
  {
    LibroCalificaciones: { type: String, required: true, trim: true },
    Nombre: { type: String, required: true, trim: true },
    Documento: { type: String, required: true, trim: true },

    // 🔥 CLAVE PRINCIPAL DE CONSULTA
    Identificacion: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    Grado: { type: String, required: true, trim: true },
    Seccion: { type: String, required: true, trim: true },

    // 🔥 CLAVE PARA LISTAR POR AÑO
    PeriodoAcademico: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    NumeroMatricula: { type: String, required: true, trim: true },

    // 🔥 DETALLE (MATERIAS)
    materias: {
      type: [materiaSchema],
      required: true,
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'Debe tener al menos una materia'
      }
    }
  },
  {
    timestamps: true
  }
);


// 🔥 ÍNDICE CLAVE (EVITA DUPLICADOS)
data_2009_2017_Schema.index(
  { Identificacion: 1, PeriodoAcademico: 1 },
  { unique: true }
);

const Data_certificados_2009_2017 = mongoose.model(
  'data_certificados_2009_2017',
  data_2009_2017_Schema
);

module.exports = Data_certificados_2009_2017;