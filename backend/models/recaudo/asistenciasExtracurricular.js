const mongoose = require('mongoose');

const asistenciasExtracurricularSchema = new mongoose.Schema({
  facturaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Factura',
    required: true
  },
 
  asistencias: {
    asistencia1: { type: Boolean, default: false },
    asistencia2: { type: Boolean, default: false },
    asistencia3: { type: Boolean, default: false },
    asistencia4: { type: Boolean, default: false }
  },
  mes_aplicado: { type: String, trim: true },
  fechaRegistro: { type: Date, default: Date.now }
});

const AsistenciasExtracurricular = mongoose.model('AsistenciasExtracurricular', asistenciasExtracurricularSchema);

module.exports = AsistenciasExtracurricular;
