// models/EstudianteModel.js
const mongoose = require('mongoose');

const estudianteSchema = new mongoose.Schema({
  num_identificacion: {
    type: String,
    required: true,
    unique: true,
  },
  nombre: String,
   
  grupo: String,
  
}, {
  timestamps: true,
});

module.exports = mongoose.model('EstudianteEPadres', estudianteSchema);
