  const mongoose = require('mongoose');

  // Definición del esquema del informe
  const informesSchema = new mongoose.Schema({
    id_producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // Referencia al modelo de Producto
      required: true
    },
    id_unidad: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Units', // Referencia al modelo de Unidades
      required: true
    },
    id_ubicacion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location', // Referencia al modelo de Ubicación
      required: true
    },
    fecha_informe: {
      type: Date,
      default: Date.now, // Fecha del informe, por defecto la fecha actual
      required: true
    },
    observaciones: {
      type: String,
      required: true, // Observaciones sobre el informe
    },
    cantidad: {
      type: Number,
      required: true, // Cantidad relacionada con el informe
    },
    estado: {
      type: String,
      enum: ['activo', 'inactivo'], // Enum para restringir los valores
      default: 'activo', // Valor por defecto
      required: true, // Hacerlo requerido
    },
  }, { timestamps: true }); // Agrega timestamps para la creación y actualización

  // Crear el modelo
  const Informes = mongoose.model('Informes', informesSchema);

  // Exportar el modelo
  module.exports = Informes;
