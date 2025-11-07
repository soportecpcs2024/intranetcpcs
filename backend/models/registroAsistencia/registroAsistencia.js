const mongoose = require('mongoose');

const asistenciaDiariaSchema = new mongoose.Schema({
    estudianteId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'EstudianteRecaudo', 
        required: true 
      }
   
      
});

module.exports = mongoose.model('Asistenciadiaria', asistenciaDiariaSchema);