const mongoose = require('mongoose');

const facturaSchema = new mongoose.Schema({
  numero_factura: { type: String, required: true, unique: true, trim: true },
  estudianteId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'EstudianteRecaudo', 
    required: true 
  },
  clases: [{
    claseId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Clase', 
      required: true 
    },
    nombreClase: { type: String, required: true, trim: true },
    costo: { type: Number, required: true, min: 0 },
    cod: { type: Number, required: true },
    dia: { 
      type: String, 
      trim: true,
      enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
    },
    hora: { type: String, trim: true }
  }],
  total: { type: Number, required: true, min: 0 },
  fechaCompra: { type: Date, default: Date.now },
  nombreRegistrador: { type: String, default: 'Lina María Hoyos Restrepo', trim: true },
  tipoPago: { 
    type: String, 
    enum: ['Efectivo', 'Datáfono', 'Nómina'], 
    required: true, 
    trim: true
  },
  mes_aplicado: { type: String, trim: true },

  // NUEVO: asistencias
  asistencias: {
    asistencia1: { type: Boolean, default: false },
    asistencia2: { type: Boolean, default: false },
    asistencia3: { type: Boolean, default: false },
    asistencia4: { type: Boolean, default: false }
  }
});

const Factura = mongoose.model('Factura', facturaSchema);
module.exports = Factura;
