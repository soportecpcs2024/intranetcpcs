const Factura = require('../../models/recaudo/factura');

// Obtener todas las facturas con datos del estudiante y asistencias
const obtenerFacturasConAsistencias = async (req, res) => {
  try {
    const facturas = await Factura.find()
      .populate('estudianteId')
      .populate('clases.claseId');

    res.json(facturas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener facturas', error });
  }
};

// ✅ Actualizar asistencias en el modelo Factura
const actualizarAsistenciasFactura = async (req, res) => {
  try {
    const { asistencias } = req.body;

    const actualizada = await Factura.findByIdAndUpdate(
      req.params.id,
      { asistencias },
      { new: true }
    ).populate('estudianteId');

    if (!actualizada) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }

    res.json(actualizada);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar asistencias', error });
  }
};

module.exports = {
  obtenerFacturasConAsistencias,
  actualizarAsistenciasFactura
};
