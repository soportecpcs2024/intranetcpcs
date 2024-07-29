// models/LlegadasTardes.js
const mongoose = require('mongoose');

const llegadasTardesSchema = new mongoose.Schema({
  num_identificacion: { type: String, required: true, ref: 'Students_datos_globales' },
  fechas: [{ type: Date, required: true }]
});

const LlegadasTardes = mongoose.model('LlegadasTardes', llegadasTardesSchema);

module.exports = LlegadasTardes;
