// models/docente.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const docenteSchema = new Schema({
  Codigo: String,
  Primer_nombre: String,
  Segundo_nombre: String,
  Primer_apellido: String,
  Segundo_apellido: String,
  Codigo_tipo_identificacion: String,
  Numero_identificacion: String,
  Genero: String,
  Email: String,
  Telefono: String,
  Celular: String,
  Fecha_nacimiento: Date,
  Lugar_nacimiento: String,
  Lugar_residencia: String,
  Direccion: String,
  Estudiantes_relacionados: [{ type: Schema.Types.ObjectId, ref: 'Estudiante' }]
});

module.exports = mongoose.model("Docente", docenteSchema);
