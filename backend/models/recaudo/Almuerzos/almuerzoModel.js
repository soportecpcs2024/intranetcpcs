const mongoose = require('mongoose');

const almuerzoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    costo: { type: Number, required: true },
    cod: { type: Number, required: true },
});

module.exports = mongoose.model('Almuerzo', almuerzoSchema);
