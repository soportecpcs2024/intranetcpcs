const mongoose = require("mongoose");

const GrupoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true, unique: true }, // "6 A"
    activo: { type: Boolean, default: true },
    orden: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Grupo", GrupoSchema);