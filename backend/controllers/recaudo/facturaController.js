const Factura = require("../../models/recaudo/factura");
const Estudiante = require("../../models/recaudo/EstudianteRecaudo");
const Clase = require("../../models/recaudo/ClaseExtracurricular");

// Función para generar un número de factura único con concurrencia controlada
const generarNumeroFactura = async () => {
  const ultimaFactura = await Factura.findOne().sort({ _id: -1 });

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
  return ["Efectivo", "Datáfono", "Nómina", "Banco"].includes(tipoPago);
};

// Crear factura
exports.crearFactura = async (req, res) => {
  try {
    const { estudianteId, clases, tipoPago, mes_aplicado } = req.body;

    if (!validarTipoPago(tipoPago)) {
      return res
        .status(400)
        .json({
          message:
            "El tipo de pago debe ser 'Efectivo', 'Datáfono', 'Nómina' o 'Banco'.",
        });
    }

    const estudiante = await Estudiante.findById(estudianteId);
    if (!estudiante)
      return res.status(404).json({ message: "Estudiante no encontrado" });

    if (!Array.isArray(clases) || clases.length === 0) {
      return res
        .status(400)
        .json({
          message:
            "El campo 'clases' debe ser un array con al menos una clase.",
        });
    }

    const clasesIds = clases.map((c) => c.claseId);
    const clasesEncontradas = await Clase.find({ _id: { $in: clasesIds } });

    if (clasesEncontradas.length !== clases.length) {
      return res
        .status(404)
        .json({ message: "Algunas clases no fueron encontradas" });
    }

    const clasesDetalle = clases.map((clase) => {
      const claseEncontrada = clasesEncontradas.find(
        (c) => c._id.toString() === clase.claseId
      );
      return {
        claseId: clase.claseId,
        nombreClase: claseEncontrada.nombre,
        cod: claseEncontrada.cod,
        costo: clase.costo,
        dia: claseEncontrada.dia,
        hora: claseEncontrada.hora,
      };
    });

    const total = clasesDetalle.reduce((sum, clase) => sum + clase.costo, 0);
    const numero_factura = await generarNumeroFactura();

    const factura = new Factura({
      numero_factura,
      estudianteId,
      clases: clasesDetalle,
      total,
      tipoPago,
      mes_aplicado
    });
    await factura.save();
    res.status(201).json(factura);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Obtener todas las facturas
exports.obtenerFacturas = async (req, res) => {
  try {
    const facturas = await Factura.find()
      .populate("estudianteId", "nombre documentoIdentidad grado")
      .populate("clases.claseId", "nombre dia hora");

    res.json(facturas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Obtener factura por ID
exports.obtenerFacturaPorId = async (req, res) => {
  try {
    const factura = await Factura.findById(req.params.id)
      .populate("estudianteId", "nombre documentoIdentidad grado")
      .populate("clases.claseId", "nombre dia hora");

    if (!factura)
      return res.status(404).json({ message: "Factura no encontrada" });

    res.json(factura);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Actualizar factura
exports.actualizarFactura = async (req, res) => {
  try {
    const { estudianteId, clases, tipoPago, mes_aplicado } = req.body;

    if (!validarTipoPago(tipoPago)) {
      return res
        .status(400)
        .json({
          message:
            "El tipo de pago debe ser 'Efectivo', 'Datáfono' o 'Nómina'.",
        });
    }

    const factura = await Factura.findById(req.params.id);
    if (!factura)
      return res.status(404).json({ message: "Factura no encontrada" });

    const estudiante = await Estudiante.findById(estudianteId);
    if (!estudiante)
      return res.status(404).json({ message: "Estudiante no encontrado" });

    const clasesIds = clases.map((c) => c.claseId);
    const clasesEncontradas = await Clase.find({ _id: { $in: clasesIds } });

    if (clasesEncontradas.length !== clases.length) {
      return res
        .status(404)
        .json({ message: "Algunas clases no fueron encontradas" });
    }

    const clasesDetalle = clases.map((clase) => {
      const claseEncontrada = clasesEncontradas.find(
        (c) => c._id.toString() === clase.claseId
      );
      return {
        claseId: clase.claseId,
        nombreClase: claseEncontrada.nombre,
        cod: claseEncontrada.cod,
        costo: clase.costo,
        dia: claseEncontrada.dia,
        hora: claseEncontrada.hora,
      };
    });

    const total = clasesDetalle.reduce((sum, clase) => sum + clase.costo, 0);

    const facturaActualizada = await Factura.findByIdAndUpdate(
      req.params.id,
      { estudianteId, clases: clasesDetalle, total, tipoPago, mes_aplicado },
      { new: true }
    );

    res.json(facturaActualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Eliminar factura
exports.eliminarFactura = async (req, res) => {
  try {
    const facturaEliminada = await Factura.findByIdAndDelete(req.params.id);
    if (!facturaEliminada)
      return res.status(404).json({ message: "Factura no encontrada" });

    res.json({ message: "Factura eliminada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
