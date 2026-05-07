const Factura = require("../../models/recaudo/factura");
const Estudiante = require("../../models/recaudo/EstudianteRecaudo");
const Clase = require("../../models/recaudo/ClaseExtracurricular");

/* ================================
   Helpers
================================ */

// Función para generar un número de factura único (simple)
const generarNumeroFactura = async () => {
  const ultimaFactura = await Factura.findOne().sort({ _id: -1 }).lean();

  let ultimoNumero = 0;
  if (ultimaFactura?.numero_factura) {
    const match = String(ultimaFactura.numero_factura).match(/FAC-(\d+)/);
    if (match) {
      ultimoNumero = parseInt(match[1], 10) || 0;
    }
  }

  return `FAC-${ultimoNumero + 1}`;
};

// Validar tipo de pago
const validarTipoPago = (tipoPago) => {
  return ["Efectivo", "Datáfono", "Nómina", "Banco"].includes(tipoPago);
};

// 🔥 NUEVO: arma una "factura completa" SIN depender de populate
const armarFacturaCompleta = async (facturaDoc) => {
  const factura = facturaDoc?.toObject ? facturaDoc.toObject() : facturaDoc;

  // 1) Estudiante
  let estudiante = null;
  let estudianteWarning = null;

  if (factura?.estudianteId) {
    estudiante = await Estudiante.findById(factura.estudianteId)
      .select("nombre documentoIdentidad grado")
      .lean();

    if (!estudiante) {
      estudianteWarning = `No se encontró estudianteId=${factura.estudianteId}`;
    }
  } else {
    estudianteWarning = "Factura no tiene estudianteId";
  }

  // 2) Clases
  const claseIds = (factura?.clases || [])
    .map((c) => c.claseId)
    .filter(Boolean)
    .map((id) => String(id));

  const clasesDB = await Clase.find({ _id: { $in: claseIds } })
    .select("nombre cod dia hora")
    .lean();

  const clasesById = new Map(clasesDB.map((c) => [String(c._id), c]));

  const clasesCompleta = (factura?.clases || []).map((c) => {
    const claseInfo = c?.claseId ? clasesById.get(String(c.claseId)) : null;

    return {
      ...c,
      claseId: c.claseId,
      claseInfo: claseInfo
        ? {
            _id: claseInfo._id,
            nombre: claseInfo.nombre,
            cod: claseInfo.cod,
            dia: claseInfo.dia,
            hora: claseInfo.hora,
          }
        : null,
      claseWarning: !claseInfo ? `No se encontró claseId=${c.claseId}` : null,
    };
  });

  return {
    ...factura,
    estudiante: estudiante || null,
    clases: clasesCompleta,
    warnings: [
      ...(estudianteWarning ? [estudianteWarning] : []),
      ...clasesCompleta
        .filter((c) => c.claseWarning)
        .map((c) => c.claseWarning),
    ],
  };
};

/* ================================
   Controllers
================================ */

// Crear factura
exports.crearFactura = async (req, res) => {
  try {
    const { estudianteId, clases, tipoPago, mes_aplicado } = req.body;

    if (!validarTipoPago(tipoPago)) {
      return res.status(400).json({
        message:
          "El tipo de pago debe ser 'Efectivo', 'Datáfono', 'Nómina' o 'Banco'.",
      });
    }

    const estudiante = await Estudiante.findById(estudianteId).lean();
    if (!estudiante) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }

    if (!Array.isArray(clases) || clases.length === 0) {
      return res.status(400).json({
        message: "El campo 'clases' debe ser un array con al menos una clase.",
      });
    }

    const clasesIds = clases.map((c) => c.claseId);
    const clasesEncontradas = await Clase.find({ _id: { $in: clasesIds } }).lean();

    if (clasesEncontradas.length !== clases.length) {
      return res
        .status(404)
        .json({ message: "Algunas clases no fueron encontradas" });
    }

    const clasesDetalle = clases.map((clase) => {
      const claseEncontrada = clasesEncontradas.find(
        (c) => String(c._id) === String(clase.claseId) // ✅ FIX
      );

      if (!claseEncontrada) {
        // ✅ evita crash si algo no cuadra
        throw new Error(`Clase no encontrada: ${clase.claseId}`);
      }

      return {
        claseId: clase.claseId,
        nombreClase: claseEncontrada.nombre,
        cod: claseEncontrada.cod,
        costo: clase.costo,
        dia: claseEncontrada.dia,
        hora: claseEncontrada.hora,
      };
    });

    const total = clasesDetalle.reduce((sum, clase) => sum + (clase.costo || 0), 0);
    const numero_factura = await generarNumeroFactura();

    const factura = new Factura({
      numero_factura,
      estudianteId,
      clases: clasesDetalle,
      total,
      tipoPago,
      mes_aplicado,
    });

    await factura.save();
    res.status(201).json(factura);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Obtener todas las facturas (populate clásico)
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

// Obtener factura por ID (populate clásico)
exports.obtenerFacturaPorId = async (req, res) => {
  try {
    const factura = await Factura.findById(req.params.id)
      .populate("estudianteId", "nombre documentoIdentidad grado")
      .populate("clases.claseId", "nombre dia hora");

    if (!factura) {
      return res.status(404).json({ message: "Factura no encontrada" });
    }

    res.json(factura);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ NUEVO: Obtener todas las facturas COMPLETAS (sin depender de populate)
exports.obtenerFacturasCompletas = async (req, res) => {
  try {
    const facturas = await Factura.find().lean();
    const completas = await Promise.all(facturas.map((f) => armarFacturaCompleta(f)));
    res.json(completas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ NUEVO: Obtener factura COMPLETA por ID (sin depender de populate)
exports.obtenerFacturaCompletaPorId = async (req, res) => {
  try {
    const factura = await Factura.findById(req.params.id).lean();
    if (!factura) {
      return res.status(404).json({ message: "Factura no encontrada" });
    }

    const completa = await armarFacturaCompleta(factura);
    res.json(completa);
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
      return res.status(400).json({
        message:
          "El tipo de pago debe ser 'Efectivo', 'Datáfono', 'Nómina' o 'Banco'.",
      });
    }

    const factura = await Factura.findById(req.params.id);
    if (!factura) {
      return res.status(404).json({ message: "Factura no encontrada" });
    }

    const estudiante = await Estudiante.findById(estudianteId).lean();
    if (!estudiante) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }

    if (!Array.isArray(clases) || clases.length === 0) {
      return res.status(400).json({
        message: "El campo 'clases' debe ser un array con al menos una clase.",
      });
    }

    const clasesIds = clases.map((c) => c.claseId);
    const clasesEncontradas = await Clase.find({ _id: { $in: clasesIds } }).lean();

    if (clasesEncontradas.length !== clases.length) {
      return res
        .status(404)
        .json({ message: "Algunas clases no fueron encontradas" });
    }

    const clasesDetalle = clases.map((clase) => {
      const claseEncontrada = clasesEncontradas.find(
        (c) => String(c._id) === String(clase.claseId) // ✅ FIX
      );

      if (!claseEncontrada) {
        throw new Error(`Clase no encontrada: ${clase.claseId}`);
      }

      return {
        claseId: clase.claseId,
        nombreClase: claseEncontrada.nombre,
        cod: claseEncontrada.cod,
        costo: clase.costo,
        dia: claseEncontrada.dia,
        hora: claseEncontrada.hora,
      };
    });

    const total = clasesDetalle.reduce((sum, clase) => sum + (clase.costo || 0), 0);

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
    if (!facturaEliminada) {
      return res.status(404).json({ message: "Factura no encontrada" });
    }

    res.json({ message: "Factura eliminada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


const codigosPermitidos = [
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "1100",
  "2200",
  "2300"
];

exports.recaudoEstadisticas = async (req, res) => {
  try {
    const facturas = await Factura.find()
      .populate("estudianteId", "nombre documentoIdentidad grado")
      .populate("clases.claseId");

    const facturasFiltradas = facturas.filter((factura) =>
      factura.clases.some((clase) =>
        codigosPermitidos.includes(String(clase.claseId?.codigo))
      )
    );

    res.json(facturasFiltradas);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};