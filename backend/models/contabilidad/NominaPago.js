// models/contabilidad/NominaPago.js
const mongoose = require("mongoose");

const NominaPagoSchema = new mongoose.Schema(
  {
    cedula: { type: String, required: true, index: true },
    nombresYApellidos: { type: String, required: true },

    cargo: { type: String, default: "" },
    seccion: { type: String, default: "" },

    // ✅ NUEVO: fecha de colilla (la que agregaste en el Excel)
    fechaColilla: { type: Date, required: true, index: true },

    // Valores
    salarioBasico: { type: Number, default: 0 },
    salarioOrdinario: { type: Number, default: 0 },
    auxTte: { type: Number, default: 0 },
    bonifExtras: { type: Number, default: 0 },
    vacaciones: { type: Number, default: 0 },
    otrosPagos: { type: Number, default: 0 },
    totalDev: { type: Number, default: 0 },

    epsAfp: { type: Number, default: 0 },
    cxcColeg: { type: Number, default: 0 },
    funeraria: { type: Number, default: 0 },
    librComfama: { type: Number, default: 0 },
    pensHijos: { type: Number, default: 0 },
    otros: { type: Number, default: 0 },
    totalDed: { type: Number, default: 0 },

    totalAPagar: { type: Number, required: true, default: 0 },

    data: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// ✅ Índice para que no haya duplicados por cédula+fecha
NominaPagoSchema.index({ cedula: 1, fechaColilla: 1 }, { unique: true });

module.exports = mongoose.model("NominaPago", NominaPagoSchema);
