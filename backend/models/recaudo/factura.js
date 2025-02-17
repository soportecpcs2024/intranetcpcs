const mongoose = require('mongoose');

const facturaSchema = new mongoose.Schema({
  estudianteId: { type: mongoose.Schema.Types.ObjectId, ref: 'EstudianteRecaudo', required: true },
  clases: [{
    claseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clase', required: true },
    nombreClase: { type: String, required: true },
    costo: { type: Number, required: true },
    dia: { type: String },
    hora: { type: String },
  }],
  total: { type: Number, required: true },
  fechaCompra: { type: Date, default: Date.now },
  nombreRegistrador: { type: String, default: 'Lina María Hoyos Restrepo' },
  tipoPago: { 
    type: String, 
    enum: ['Efectivo', 'Datáfono','Nómina'], 
    required: true 
  } // Nuevo campo para tipo de pago
});

module.exports = mongoose.model('Factura', facturaSchema);
