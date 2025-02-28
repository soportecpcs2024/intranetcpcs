const mongoose = require('mongoose');

const facturaSchema = new mongoose.Schema({
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
  }
});

module.exports = mongoose.model('Factura', facturaSchema);
