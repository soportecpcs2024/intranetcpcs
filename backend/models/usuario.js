const mongoose = require('mongoose');

// Definir el esquema para el usuario
const usuarioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    trim: true,
  },
  role: {
    type: String,
    default: "user", // Se puede ajustar según los roles en tu aplicación
  },
  active: {
    type: Boolean,
    default: true,
  },
  avatar: {
    type: String,
    default: "", // O algún valor por defecto que prefieras
  },
}, {
  timestamps: true,
  // Añadir más opciones según sea necesario
});

// Crear el modelo de usuario
const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;

