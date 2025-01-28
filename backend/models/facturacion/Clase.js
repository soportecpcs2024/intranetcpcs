const mongoose = require('mongoose');

const ClaseSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    docente: { type: String, required: true },
    costo: { type: Number, required: true },
    horario: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Clase', ClaseSchema);
