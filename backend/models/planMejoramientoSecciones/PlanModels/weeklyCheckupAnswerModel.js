const mongoose = require('mongoose');

const { AREA_ENUM } = require("./checkupQuestionModel");


const AnswerItemSchema = new mongoose.Schema(
{
 questionId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"CheckupQuestion",
  required:true
 },

 score:{
  type:Number,
  required:true,
  min:1,
  max:5
 }

},
{ _id:false }
);


const EvidenceSchema = new mongoose.Schema(
{
 type:{type:String,enum:["link","file"],default:"link"},
 url:{type:String,trim:true,default:""},
 name:{type:String,trim:true,default:""}
},
{ _id:false }
);


const WeeklyCheckupAnswerSchema = new mongoose.Schema(
{

 planId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Plan",
  required:true,
  index:true
 },

 area:{
  type:String,
  required:true,
  enum:AREA_ENUM,
  index:true
 },

 periodo:{
  type:Number,
  required:true,
  min:1,
  max:4
 },

 docenteId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User",
  required:true,
  index:true
 },

 evaluadorId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User",
  default:null
 },

 grupo:{
  type:String,
  default:""
 },

 weekStart:{
  type:Date,
  required:true,
  index:true
 },

 answers:[AnswerItemSchema],

 observaciones:{
  type:String,
  default:""
 },

 evidencias:[EvidenceSchema]

},
{ timestamps:true }
);


WeeklyCheckupAnswerSchema.index(
{ planId:1, docenteId:1, area:1, periodo:1, weekStart:1, grupo:1 },
{ unique:true }
);


module.exports = mongoose.model(
"WeeklyCheckupAnswer",
WeeklyCheckupAnswerSchema
);