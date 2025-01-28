// models/facturacion/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    numIdentificacion: { type: String, required: true, unique: true },
    clasesCompradas: [
        {
            claseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clase', required: true },
            costo: { type: Number, required: true },
            mes: { type: String, required: true }
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
