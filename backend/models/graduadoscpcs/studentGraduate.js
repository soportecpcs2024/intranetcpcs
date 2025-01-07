const mongoose = require('mongoose');

// Definir el esquema para el estudiante
const studentGraduateSchema = new mongoose.Schema({
  codigoMatricula: { type: String, required: true },
  folio: { type: String, required: true },
  nombre: { type: String, required: true },
  tipoDocumento: { type: String, required: true },
  numDocumento: { type: String, required: true },
  añoLectivo: { type: Number, required: true },
  grupo: { type: String, required: true },
  promovido: { type: String, required: true },
  observacion: { type: String, required: true },
  promedio: { type: Number, required: true },
  materias: {
    naturalesYEducacionAmbiental: { type: Number, required: true },
    cienciasPoliticasYEconomicas: { type: Number, required: true },
    cienciasSociales: { type: Number, required: true },
    civicaYConstitucion: { type: Number, required: true },
    educacionArtisticaYCultural: { type: Number, required: true },
    educacionCristiana: { type: Number, required: true },
    educacionEticaYValores: { type: Number, required: true },
    educacionFisicaYRecreacionYDeportes: { type: Number, required: true },
    humanidadesLenguaCastellanaEIdiomaExtranjero: { type: Number, required: true },
    idiomaExtranjeroIngles: { type: Number, required: true },
    lenguaCastellana: { type: Number, required: true },
    matematicas: { type: Number, required: true },
    tecnologiaEInformatica: { type: Number, required: true }
  },
  rector: { type: String, required: true },
  ccRector: { type: String, required: true },
  ciudadExpedicionRector: { type: String, required: true },
  secretaria: { type: String, required: true },
  ccSecretaria: { type: String, required: true },
  ciudadExpedicionSecretaria: { type: String, required: true }
});

// Crear el modelo basado en el esquema
const StudentGraduate = mongoose.model('StudentGraduate', studentGraduateSchema);

module.exports = StudentGraduate;
