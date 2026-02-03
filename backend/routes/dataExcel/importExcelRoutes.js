
const ExcelJS = require("exceljs");
const uploadExcel = require("../../middlewares/uploadExcel");

const router = express.Router();

function cellValue(v) {
  if (v == null) return null;
  if (typeof v === "object") {
    if (v.text) return v.text;                 // rich text
    if (v.result != null) return v.result;     // fórmula
    if (v.richText) return v.richText.map(x => x.text).join("");
  }
  return v;
}

function toNumber(v) {
  const n = Number(String(v ?? "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

router.post("/preview", uploadExcel.single("file"), async (req, res) => {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({ message: "Archivo no recibido" });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    const sheet = workbook.worksheets[0];
    if (!sheet) return res.status(400).json({ message: "El Excel no tiene hojas" });

    const rows = [];
    const errors = [];

    for (let rowNumber = 11; rowNumber <= sheet.rowCount; rowNumber++) {
      const row = sheet.getRow(rowNumber);

      const raw = {
        id: cellValue(row.getCell(1).value),       // A
        nombre: cellValue(row.getCell(2).value),   // B
        cargo: cellValue(row.getCell(3).value),    // C
        seccion: cellValue(row.getCell(4).value),  // D
        salario: cellValue(row.getCell(5).value),  // E
        dias: cellValue(row.getCell(6).value),     // F
      };

      // Saltar filas completamente vacías
      const isEmpty = Object.values(raw).every(
        (v) => v == null || String(v).trim() === ""
      );
      if (isEmpty) continue;

      const data = {
        id: String(raw.id ?? "").trim(),
        nombre: String(raw.nombre ?? "").trim(),
        cargo: String(raw.cargo ?? "").trim(),
        seccion: String(raw.seccion ?? "").trim(),
        salario: toNumber(raw.salario),
        dias: toNumber(raw.dias),
      };

      // Validaciones mínimas (ajusta a tus reglas)
      const rowErrs = [];
      if (!data.id) rowErrs.push("id es obligatorio");
      if (!data.nombre) rowErrs.push("nombre es obligatorio");
      if (data.salario == null) rowErrs.push("salario debe ser numérico");
      if (data.dias == null) rowErrs.push("dias debe ser numérico");

      if (rowErrs.length) {
        errors.push({ row: rowNumber, errors: rowErrs, data });
      } else {
        rows.push(data);
      }
    }

    return res.json({
      summary: {
        total: rows.length + errors.length,
        validas: rows.length,
        errores: errors.length,
      },
      preview: rows.slice(0, 200),
      errors: errors.slice(0, 200),
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

module.exports = router;
