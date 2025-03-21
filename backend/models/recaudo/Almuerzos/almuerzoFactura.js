const mongoose = require('mongoose');

const facturaAlmuerzoSchema = new mongoose.Schema({
    fechaCompra: { type: Date, default: Date.now },
    almuerzos: [{
        almuerzoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Almuerzo', required: true },
        cantidad: { type: Number, required: true }
    }],
    total: { type: Number, required: true }
});

module.exports = mongoose.model('FacturaAlmuerzo', facturaAlmuerzoSchema);
