const mongoose = require('mongoose');

// Definir el esquema para el estudiante
const CertificadosEstudio2025Schema = new mongoose.Schema({
  
  NOMBRE: { type: String, required: true },
  Tipo_de_documento: { type: String, required: true },
  Número_de_identificación: { type: String, required: true },
  Grado: { type: String, required: true },
  SECCION: { type: String, required: true },
   
});

// Crear el modelo basado en el esquema
const CertificadosEstudio2025 = mongoose.model('CertificadosEstudio2025', CertificadosEstudio2025Schema);

module.exports = CertificadosEstudio2025;
