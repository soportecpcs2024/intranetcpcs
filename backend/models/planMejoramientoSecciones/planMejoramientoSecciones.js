const mongoose = require('mongoose');

const planMejoramientoSeccionesSchema = new mongoose.Schema({
   
  periodo: { type: String, required: true },
  seccion: { type: String, required: true },
  metasAcademicas: { type: String, required: true },
  estrategiasElevarNivel: { type: String, required: true },

  
  
  estudiantesDificultadDisciplinarias: { type: String, required: true },
  estudiantesPendientesDisciplinarios: { type: String, required: true },
  estudiantesSancionComite: { type: String, required: true },
  faltasRepetidasGrupo: { type: String, required: true },
  estrategiasTrabajar: { type: String, required: true }
});

module.exports = mongoose.model('PlanMejoramientoSecciones', planMejoramientoSeccionesSchema);