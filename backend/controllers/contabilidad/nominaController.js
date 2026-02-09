// controllers/contabilidad/nominaController.js
const XLSX = require("xlsx");
const fs = require("fs");
const NominaPago = require("../../models/contabilidad/NominaPago");

function normalizeHeader(v) {
  return String(v ?? "")
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

function safeCell(v) {
  if (v === undefined || v === null) return "";
  if (typeof v === "object") return ""; // evita objetos raros
  return v;
}

function toIntMoney(v) {
  if (v === "" || v === null || v === undefined) return 0;
  const n = Number(v);
  if (Number.isNaN(n)) return 0;
  return Math.trunc(n);
}

function onlyDigits(v) {
  return String(v ?? "").replace(/\D/g, "");
}

// Parsea fechas tipo "30/1/2026" o "30-01-2026" o Date de Excel
function parseFechaColilla(v) {
  if (v instanceof Date && !isNaN(v)) {
    return new Date(Date.UTC(v.getFullYear(), v.getMonth(), v.getDate()));
  }

  const s = String(v ?? "").trim();
  if (!s) return null;

  const m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (!m) return null;

  const dd = Number(m[1]);
  const mm = Number(m[2]);
  const yyyy = Number(m[3]);

  const d = new Date(Date.UTC(yyyy, mm - 1, dd));
  if (isNaN(d)) return null;
  return d;
}

// Parsea query fecha YYYY-MM-DD para buscar
function parseFechaQueryYYYYMMDD(s) {
  const m = String(s ?? "").trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const yyyy = Number(m[1]);
  const mm = Number(m[2]);
  const dd = Number(m[3]);
  const d = new Date(Date.UTC(yyyy, mm - 1, dd));
  if (isNaN(d)) return null;
  return d;
}

exports.uploadNomina = async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: 'No se recibió archivo (field debe llamarse "file")' });
    }

    filePath = req.file.path;

    // 1) Leer archivo
    const wb = XLSX.readFile(filePath, { cellDates: true });
    const sheetName = wb.SheetNames[0];
    const ws = wb.Sheets[sheetName];

    // 2) Matriz
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

    // 3) Eliminar primeras 8 filas
    const trimmed = rows.slice(8);

    if (trimmed.length === 0) {
      return res.status(400).json({
        message: "Después de borrar 8 filas no quedó información.",
      });
    }

    // (Opcional) si tu archivo trae una fila “basura” debajo del header, déjalo:
    if (trimmed.length > 1) trimmed.splice(1, 1);

    // 4) Encabezados
    const header = trimmed[0];
    const headerMap = {};
    header.forEach((h, idx) => {
      const key = normalizeHeader(h);
      if (key) headerMap[key] = idx;
    });

    // ✅ Incluye la columna FECHA (ajusta el nombre si en tu Excel se llama diferente)
    const inputColumns = [
      "FECHA",
      "CÉDULA",
      "NOMBRES Y APELLIDOS",
      "CARGO",
      "SECCION",
      "SALARIO BÁSICO",
      "SALARIO ORDINARIO",
      "AUX TTE",
      "BONIF/EXTRAS",
      "VACACIONES",
      "OTROS PAGOS",
      "TOTAL DEV.",
      "EPS /AFP",
      "CxC COLEG",
      "FUNERARIA",
      "LIBR.COMFAMA",
      "PENS.HIJOS",
      "OTROS",
      "TOTAL DED.",
      "TOTAL A PAGAR",
    ];

    const colIdx = inputColumns.map((col) => headerMap[normalizeHeader(col)]);

    const missing = inputColumns.filter((c, i) => colIdx[i] === undefined);
    if (missing.length) {
      return res.status(400).json({
        message: "No encontré estas columnas en el encabezado.",
        missing,
      });
    }

    // Columnas de dinero sin decimales
    const moneyCols = new Set([
      "SALARIO BÁSICO",
      "SALARIO ORDINARIO",
      "AUX TTE",
      "BONIF/EXTRAS",
      "VACACIONES",
      "OTROS PAGOS",
      "TOTAL DEV.",
      "EPS /AFP",
      "CxC COLEG",
      "FUNERARIA",
      "LIBR.COMFAMA",
      "PENS.HIJOS",
      "OTROS",
      "TOTAL DED.",
      "TOTAL A PAGAR",
    ]);

    const docs = [];

    for (let r = 1; r < trimmed.length; r++) {
      const row = trimmed[r];

      // Construir newRow
      const newRow = colIdx.map((i, index) => {
        let value = row[i];

        if (moneyCols.has(inputColumns[index])) return toIntMoney(value);

        // FECHA se deja tal cual (se parsea luego)
        if (inputColumns[index] === "FECHA") return value;

        value = safeCell(value);
        return String(value ?? "").trim();
      });

      const hasAny = newRow.some((v) => String(v).trim() !== "");
      if (!hasAny) continue;

      // Objeto completo (data)
      const obj = {};
      inputColumns.forEach((colName, idx) => {
        obj[colName] = newRow[idx];
      });

      const cedula = onlyDigits(obj["CÉDULA"]);
      const nombresYApellidos = String(obj["NOMBRES Y APELLIDOS"] ?? "").trim();

      const fechaColilla = parseFechaColilla(obj["FECHA"]);
      if (!fechaColilla) continue; // o puedes devolver error si debe ser obligatoria

      if (!cedula || !nombresYApellidos) continue;

      docs.push({
        cedula,
        nombresYApellidos,
        cargo: String(obj["CARGO"] ?? "").trim(),
        seccion: String(obj["SECCION"] ?? "").trim(),

        fechaColilla,

        salarioBasico: toIntMoney(obj["SALARIO BÁSICO"]),
        salarioOrdinario: toIntMoney(obj["SALARIO ORDINARIO"]),
        auxTte: toIntMoney(obj["AUX TTE"]),
        bonifExtras: toIntMoney(obj["BONIF/EXTRAS"]),
        vacaciones: toIntMoney(obj["VACACIONES"]),
        otrosPagos: toIntMoney(obj["OTROS PAGOS"]),
        totalDev: toIntMoney(obj["TOTAL DEV."]),

        epsAfp: toIntMoney(obj["EPS /AFP"]),
        cxcColeg: toIntMoney(obj["CxC COLEG"]),
        funeraria: toIntMoney(obj["FUNERARIA"]),
        librComfama: toIntMoney(obj["LIBR.COMFAMA"]),
        pensHijos: toIntMoney(obj["PENS.HIJOS"]),
        otros: toIntMoney(obj["OTROS"]),
        totalDed: toIntMoney(obj["TOTAL DED."]),

        totalAPagar: toIntMoney(obj["TOTAL A PAGAR"]),

        data: obj,
      });
    }

    if (docs.length === 0) {
      return res.status(400).json({
        message:
          "No se encontraron filas válidas. Revisa que FECHA, CÉDULA y NOMBRES Y APELLIDOS estén correctos.",
      });
    }

    // Inserta (si tienes índice unique por cedula+fechaColilla y ya existe, fallará)
    // Si prefieres “actualizar si existe”, dime y te lo dejo con bulkWrite upsert.
    await NominaPago.insertMany(docs, { ordered: false });

    // borrar archivo subido (opcional)
    try {
      fs.unlinkSync(filePath);
    } catch (_) {}

    return res.json({
      message: "Nómina cargada correctamente",
      inserted: docs.length,
    });
  } catch (err) {
    if (filePath) {
      try {
        fs.unlinkSync(filePath);
      } catch (_) {}
    }

    return res.status(500).json({
      message: "Error procesando nómina",
      error: err.message,
    });
  }
};

// ✅ Buscar por cédula + fecha (YYYY-MM-DD)
exports.getByCedulaFecha = async (req, res) => {
  try {
    const { cedula } = req.params;
    const { fecha } = req.query;

    if (!fecha) {
      return res.status(400).json({
        message: "Falta el parámetro fecha. Usa ?fecha=YYYY-MM-DD",
      });
    }

    const fechaColilla = parseFechaQueryYYYYMMDD(fecha);
    if (!fechaColilla) {
      return res.status(400).json({
        message: "Formato inválido. Usa fecha=YYYY-MM-DD (ej: 2026-01-30)",
      });
    }

    const data = await NominaPago.findOne({ cedula, fechaColilla });

    if (!data) {
      return res.status(404).json({
        message: "No encontrado para esa cédula y fecha",
      });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: "Error buscando nómina",
      error: err.message,
    });
  }
};


// ✅ Buscar todos los registros por cédula
exports.getByCedula = async (req, res) => {
  try {
    const { cedula } = req.params;

    const data = await NominaPago.find({ cedula })
      .sort({ fechaColilla: -1 }); // opcional: ordena por fecha (más reciente primero)

    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "No se encontraron registros para esa cédula",
      });
    }

    res.json({
      cedula,
      totalRegistros: data.length,
      registros: data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error buscando nómina por cédula",
      error: err.message,
    });
  }
};

exports.deleteByFecha = async (req, res) => {
  try {
    const { fecha } = req.query;

    if (!fecha) {
      return res.status(400).json({
        message: "Falta el parámetro fecha. Usa ?fecha=YYYY-MM-DD",
      });
    }

    const d = parseFechaQueryYYYYMMDD(fecha);
    if (!d) {
      return res.status(400).json({
        message: "Formato inválido. Usa fecha=YYYY-MM-DD (ej: 2026-01-30)",
      });
    }

    // rango del día en UTC
    const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
    const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1, 0, 0, 0, 0));

    const result = await NominaPago.deleteMany({
      fechaColilla: { $gte: start, $lt: end },
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "No se encontraron registros para esa fecha",
      });
    }

    return res.json({
      message: "Registros eliminados correctamente",
      fecha,
      eliminados: result.deletedCount,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error eliminando por fecha",
      error: err.message,
    });
  }
};
