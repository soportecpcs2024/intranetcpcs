const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentNivelSuperiorSchema = new Schema({
  grupo: String,
  nombre: String,
  periodo: String,
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
});

module.exports = mongoose.model("StudentNivelSuperior", StudentNivelSuperiorSchema);
