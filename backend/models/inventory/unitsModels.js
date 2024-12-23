const mongoose = require('mongoose');

const Unitschema = new mongoose.Schema({
    id_producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Referencia al modelo de Producto
        required: true
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true
    },
    estado: {
      type: String,
      enum: ["activo", "Inactivo"],  // Enum to restrict values
      default: "Inactivo",  // Default value
      required: true,  // Making it required
    },
    entregado_por: {
        type: String,
        required: true,
      },
      recibido_por: {
        type: String,
        default: "Administración",
      },
      email_recibido_por: {
        type: String,
        default: "email",
      },
      aprobado_por: {
        type: String,
        default: "Administración",
      },
      fecha_entrega: {
        type: Date,  // Date type to handle dates
      },
      observaciones: {
        type: String,
        required: true,
      },
       
    
});

module.exports = mongoose.model('Units', Unitschema);

