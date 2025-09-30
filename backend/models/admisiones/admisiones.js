// models/EstudianteModel.js
const mongoose = require("mongoose");

const AdmisionesEstudianteSchema = new mongoose.Schema(
  {
    Estudiantes: { type: String, required: true }, // nombre completo o similar
    Identificacion: { type: String, required: true, unique: true },

    Madre: { type: String },
    Padre: { type: String },
    Acudiente_financiero: { type: String },
    Acudiente_familiar: { type: String },

    Correo: { type: String },
    Celular: { type: String }, // lo paso a String para evitar problemas con ceros iniciales
    Telefono: { type: String },

    Direccion: { type: String },
    Direccion_alt: { type: String }, // había repetidos en tu lista
    Municipio: { type: String },
    Barrio: { type: String },

    Asesor: { type: String },
    Como_se_entero: { type: String },
    Medio_contacto: { type: String },

    Contacto_padre: { type: String },
    Estado_civil: { type: String },
    Docente_entrevista_Padres: { type: String },
    Docente_entrevista_estudiante: { type: String },
    Fecha_proceso_entrevista: { type: Date },

    correo_madre: { type: String },
    correo_padre: { type: String },
    Contacto_madre: { type: String },

    Diagnostico: { type: String },
    Detalle_diagnostico: { type: String },

    Reingreso: { type: String },
    Compromiso_disc: { type: String },
    Compromiso_pedag: { type: String },

    Fecha_formulario_recibido: { type: Date },
    Formulario: { type: String },
    Ano_lectivo: { type: String },

    Fecha_Registro: { type: Date, default: Date.now },
    Fecha_ultima_actividad: { type: Date },
    Negocio: { type: String },
    Fecha_tentativa_cierre: { type: Date },

    Grado: { type: String },
    Concepto_ed_cristiana: { type: String },
    Congregacion: { type: String },
    Lider_espiritual: { type: String },
    Concepto_psicologia: { type: String },
    Concepto_psicologia_familia: { type: String },
    Test_padres: { type: String },
    Test_estudiante: { type: String },
    Espiritual: { type: String },
    Concepto_adm: { type: String },

    Datacredito: { type: String },
    Codeudor: { type: String },
    Observaciones_adm: { type: String },
    Aprobado_admisiones: { type: String },
    Fecha_aprobado_admisiones: { type: Date },
    Observaciones_rectoria: { type: String },

    Apelacion: { type: String },
    Detalles_apelacion: { type: String },
    Resultado_apelacion: { type: String },

    Estado_negocio: { type: String, required: true },
    Causa_perdida: { type: String },
  },
  {
    timestamps: true,
    collection: "AdmisionesEstudiantes",
  }
);

module.exports = mongoose.model("Admisiones_Estudiante", AdmisionesEstudianteSchema);
daEsc_Pares