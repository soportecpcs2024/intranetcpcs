const mongoose = require('mongoose');

const aporteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    aporte: { type: Number, required: true },
    cod: { type: Number, required: true },
});

module.exports = mongoose.model('aporte', aporteSchema);