// models/student_notes_sheet_model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentNotesSchema = new Schema({
  grupo: String,
  codigo: Number,
  nombre: String,
  periodo: String,
  puesto: Number,
  promedio: Number,
  ciencias_naturales: Number,
  fisica: Number,
  quimica: Number,
  ciencias_politicas_economicas: Number,
  ciencias_sociales: Number,
  civica_y_constitucion: Number,
  educacion_artistica: Number,
  educacion_cristiana: Number,
  educacion_etica: Number,
  educacion_fisica: Number,
  filosofia: Number,
  idioma_extranjero: Number,
  lengua_castellana: Number,
  matematicas: Number,
  tecnologia: Number,
  observaciones: String,
  metas: String,
  reporte_nivelacion: String,
   
});

module.exports = mongoose.model('StudentNotes', StudentNotesSchema);
