// models/EstudianteModel.js
const mongoose = require('mongoose');

const estudianteSchema = new mongoose.Schema({
  codigo:String,
 documento: {
    type: String,
    required: true,
    unique: true,
  },
  nombre: String,
   
  grupo: String,
  grado:String,
   hermanos: {
    type: Boolean,
    default: false,
  }
   
  
}, {
  timestamps: true,
});

module.exports = mongoose.model('EstudianteEPadres', estudianteSchema);
