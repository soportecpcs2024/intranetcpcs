const mongoose = require('mongoose');

const asistenciaSchema = new mongoose.Schema({
  estudianteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Estudiante', required: true },
  escuelaId: { type: mongoose.Schema.Types.ObjectId, ref: 'EscuelaPadres', required: true },
  asistencias: [{
    fecha: { type: Date, required: true },
    presente: { type: Boolean, default: false }
  }]
});

module.exports = mongoose.model('AsistenciaPadres', asistenciaSchema);
