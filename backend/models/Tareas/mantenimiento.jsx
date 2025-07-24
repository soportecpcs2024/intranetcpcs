const mongoose = require("mongoose");

const mantenimientoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: String,
  fechaCreacion: { type: Date, default: Date.now },
  fechaProgramada: { type: Date, required: true },  
  fechaRealizacion: { type: Date, default: null },  
  responsable: { type: String, required: true },

  area: {
    type: String,
    enum: ["Tecnología", "Planta física", "Eléctricos", "Acueducto"],
    required: true,
  },

  tipoMantenimiento: {
    type: String,
    enum: ["Preventivo", "Correctivo"],
    required: true,
  },

  observaciones: String,

  servicio: {
    type: String,
    enum: ["Interno", "Externo"],
    required: true,
  },

  estado: {
    type: String,
    enum: ["Pendiente", "Terminado"],
    default: "Pendiente",
  },

  cumplimiento: {
    type: String,
    enum: ["Eficiente", "Tardío"],
    default: null,
  },
});

module.exports = mongoose.model("Mantenimiento", mantenimientoSchema);
