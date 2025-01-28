// models/facturacion/Invoice.js
const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    alumnoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    clases: [
        {
            claseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clase', required: true },
            costo: { type: Number, required: true }
        }
    ],
    total: { type: Number, required: true },
    mes: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;
