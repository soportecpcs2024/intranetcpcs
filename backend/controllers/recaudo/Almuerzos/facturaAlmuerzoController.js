const FacturaAlmuerzo = require('../../../models/recaudo/Almuerzos/almuerzoFactura');
const Almuerzo = require('../../../models/recaudo/Almuerzos/almuerzoModel');

// Crear factura de almuerzos
exports.crearFactura = async (req, res) => {
  try {
    const { almuerzos } = req.body;
    let total = 0;

    for (const item of almuerzos) {
      const almuerzo = await Almuerzo.findById(item.almuerzoId);
      if (!almuerzo) {
        return res.status(404).json({ message: `Almuerzo con ID ${item.almuerzoId} no encontrado` });
      }
      total += almuerzo.costo * item.cantidad;
    }

    const factura = new FacturaAlmuerzo({ almuerzos, total });
    await factura.save();
    res.status(201).json(factura);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todas las facturas
exports.obtenerFacturas = async (req, res) => {
  try {
    const facturas = await FacturaAlmuerzo.find().populate('almuerzos.almuerzoId');
    res.json(facturas);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener una factura por ID
exports.obtenerFacturaPorId = async (req, res) => {
  try {
    const factura = await FacturaAlmuerzo.findById(req.params.id).populate('almuerzos.almuerzoId');
    if (!factura) return res.status(404).json({ message: 'Factura no encontrada' });
    res.json(factura);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar una factura por ID
exports.eliminarFactura = async (req, res) => {
  try {
    const factura = await FacturaAlmuerzo.findByIdAndDelete(req.params.id);
    if (!factura) return res.status(404).json({ message: 'Factura no encontrada' });
    res.json({ message: 'Factura eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
