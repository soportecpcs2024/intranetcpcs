const mongoose = require('mongoose');

const AREA_ENUM = [
  "CIENCIAS_NATURALES",
  "CIENCIAS_SOCIALES",
  "MATEMATICAS",
  "LECTURA_CRITICA",
  "BILINGUISMO"
];

const CheckupQuestionSchema = new mongoose.Schema(
{
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
    required: true,
    index: true,
  },

  area: {
    type: String,
    required: true,
    enum: AREA_ENUM,
    index: true,
  },

  periodo: { type: Number, required: true, min: 1, max: 4 },

  numero: { type: Number, required: true },

  texto: { type: String, required: true },

  isActive: { type: Boolean, default: true }

},
{ timestamps:true }
);

CheckupQuestionSchema.index(
 { planId:1, area:1, periodo:1, numero:1 },
 { unique:true }
);

const CheckupQuestion = mongoose.model("CheckupQuestion",CheckupQuestionSchema);

module.exports = {
 CheckupQuestion,
 AREA_ENUM
};