const FacturaAlmuerzo = require('../../../models/recaudo/Almuerzos/almuerzoFactura');
const Almuerzo = require('../../../models/recaudo/Almuerzos/almuerzoModel');
const Estudiante = require('../../../models/recaudo/EstudianteRecaudo');

// Función para generar un número de factura único con concurrencia controlada
const generarNumeroFactura = async () => {
  const ultimaFactura = await FacturaAlmuerzo.findOne().sort({ _id: -1 });

  let ultimoNumero = 0;
  if (ultimaFactura && ultimaFactura.numero_factura) {
    const match = ultimaFactura.numero_factura.match(/FAC-(\d+)/);
    if (match) {
      ultimoNumero = parseInt(match[1], 10) || 0;
    }
  }

  return `FAC-${ultimoNumero + 1}`;
};

// Función para validar el tipo de pago
const validarTipoPago = (tipoPago) => {
  return ["Efectivo", "Datáfono", "Nómina"].includes(tipoPago);
};

// Crear factura de almuerzos
exports.crearFactura = async (req, res) => {
  try {
    const { almuerzos, estudianteId, tipoPago } = req.body;
    
    // Validar tipo de pago
    if (!validarTipoPago(tipoPago)) {
      return res.status(400).json({
        message: "El tipo de pago debe ser 'Efectivo', 'Datáfono' o 'Nómina'.",
      });
    }

    // Verificar si el estudiante existe
    const estudiante = await Estudiante.findById(estudianteId);
    if (!estudiante) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }

    // Calcular total y validar almuerzos
    let total = 0;
    for (const item of almuerzos) {
      const almuerzo = await Almuerzo.findById(item.almuerzoId);
      if (!almuerzo) {
        return res.status(404).json({ message: `Almuerzo con ID ${item.almuerzoId} no encontrado` });
      }
      total += almuerzo.costo * item.cantidad;
    }

    // Generar número de factura único
    const numeroFactura = await generarNumeroFactura();

    // Crear la factura
    const factura = new FacturaAlmuerzo({ 
      numero_factura: numeroFactura,
      estudianteId, 
      almuerzos, 
      total, 
      tipoPago 
    });

    await factura.save();
    res.status(201).json(factura);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todas las facturas
exports.obtenerFacturas = async (req, res) => {
  try {
    const facturas = await FacturaAlmuerzo.find()
      .populate('almuerzos.almuerzoId')
      .populate('estudianteId', 'nombre codigo'); // Puedes modificar qué datos del estudiante incluir

    res.json(facturas);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener una factura por ID
exports.obtenerFacturaPorId = async (req, res) => {
  try {
    const factura = await FacturaAlmuerzo.findById(req.params.id)
      .populate('almuerzos.almuerzoId')
      .populate('estudianteId', 'nombre codigo');

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
