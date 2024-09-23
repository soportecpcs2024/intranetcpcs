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
        default: 'disponible' // Ejemplo de valor por defecto
    }
});

module.exports = mongoose.model('Units', Unitschema);

