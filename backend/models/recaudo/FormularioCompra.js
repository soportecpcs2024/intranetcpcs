const mongoose = require('mongoose');

const formularioCompraSchema = new mongoose.Schema({
  nombreEstudiante: { type: String, required: true, trim: true },
  gradoPostula: { type: String, required: true, trim: true },
 
  tipoFormulario: {
    type: String,
    required: true,
    enum: ['2026', '2025', 'Open House'],
    trim: true
  },
  tipoPago: { 
    type: String, 
    enum: ['Efectivo', 'Datáfono', 'Nómina'], 
    required: true, 
    trim: true
  },
  costo: {
    type: Number,
    required: true  // ✅ mantenemos esto, porque lo estableceremos desde el controlador
  },
  fechaCompraFormulario: { type: Date, default: Date.now }
});

// ❌ Ya no necesitas el pre('save')
// formularioCompraSchema.pre('save', ... )

const FormularioCompra = mongoose.model('FormularioCompra', formularioCompraSchema);
module.exports = FormularioCompra;
