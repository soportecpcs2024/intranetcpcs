const mongoose = require('mongoose');

const asistenciaPeiSchema = new mongoose.Schema({
    estudianteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EstudianteEPadres', // Asegúrate que el nombre coincida
        required: true,
      },
      
});