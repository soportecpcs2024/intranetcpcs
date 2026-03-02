const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema(
{
 name:{
  type:String,
  required:true,
  trim:true
 },

 year:{
  type:Number,
  required:true,
  min:2000,
  max:2100
 },

 isActive:{
  type:Boolean,
  default:false,
  index:true
 },

 description:{
  type:String,
  default:""
 }

},
{ timestamps:true }
);


// Índice único por año
PlanSchema.index({year:1},{unique:true});


module.exports = mongoose.model("Plan",PlanSchema);