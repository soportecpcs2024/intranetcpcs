const mongoose = require('mongoose');

const facturaAlmuerzoSchema = new mongoose.Schema({
     numero_factura: { type: String, required: true, unique: true, trim: true },
      estudianteId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'EstudianteRecaudo', 
        required: true 
      },
    fechaCompra: { type: Date, default: Date.now },
    almuerzos: [{
        almuerzoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Almuerzo', required: true },
        cantidad: { type: Number, required: true }
    }],
    total: { type: Number, required: true },
    tipoPago: { 
        type: String, 
        enum: ['Efectivo', 'Datáfono', 'Nómina'], 
        required: true, 
        trim: true
      }
});

module.exports = mongoose.model('FacturaAlmuerzo', facturaAlmuerzoSchema);
