const mongoose = require('mongoose');

const metasGrupoSchema = new mongoose.Schema({
  grupo: { type: String, required: true },
  periodo: { type: String, required: true },
  academicos: { type: String, required: true },
  estudiantesDificultadDisciplinarias: { type: String, required: true },
  estrategiasImplementarAcademico: { type: String, required: true },
  estudiantesPendientesDisciplinarios: { type: String, required: true },
  estudiantesSancionComite: { type: String, required: true },
  faltasRepetidasGrupo: { type: String, required: true },
  estrategiasTrabajar: { type: String, required: true }
});

module.exports = mongoose.model('MetasGrupo', metasGrupoSchema);
