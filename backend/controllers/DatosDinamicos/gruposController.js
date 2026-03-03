const Grupo = require("../../models/DatosDinamicos/gruposModel");

// ✅ GET /api/grupos?activos=true|false
exports.listarGrupos = async (req, res) => {
  try {
    const activos = req.query.activos === "false" ? false : true;

    const filtro = activos ? { activo: true } : {};
    const grupos = await Grupo.find(filtro)
      .sort({ orden: 1, nombre: 1 })
      .select("nombre activo orden"); // 👈 (recomendado) deja más info por si la necesitas

    res.json(grupos);
  } catch (error) {
    console.error("Error listando grupos:", error);
    res.status(500).json({ message: "Error listando grupos" });
  }
};

// ✅ POST /api/grupos
exports.crearGrupo = async (req, res) => {
  try {
    const { nombre, activo = true, orden = 0 } = req.body;

    if (!nombre?.trim()) {
      return res.status(400).json({ message: "El nombre es obligatorio" });
    }

    const nombreLimpio = nombre.trim();

    // Verificar si ya existe
    const existe = await Grupo.findOne({ nombre: nombreLimpio });
    if (existe) {
      return res.status(400).json({ message: "El grupo ya existe" });
    }

    const nuevoGrupo = await Grupo.create({
      nombre: nombreLimpio,
      activo,
      orden,
    });

    res.status(201).json(nuevoGrupo);
  } catch (error) {
    console.error("Error creando grupo:", error);
    res.status(500).json({ message: "Error creando grupo" });
  }
};

// ✅ POST /api/grupos/bulk
exports.crearGruposBulk = async (req, res) => {
  try {
    const grupos = req.body;

    if (!Array.isArray(grupos) || grupos.length === 0) {
      return res
        .status(400)
        .json({ message: "Debe enviar un array de grupos con elementos" });
    }

    // Normalizar nombres y filtrar inválidos
    const payload = grupos
      .map((g, i) => ({
        nombre: String(g?.nombre || "").trim(),
        activo: typeof g?.activo === "boolean" ? g.activo : true,
        orden: Number.isFinite(Number(g?.orden)) ? Number(g.orden) : i + 1,
      }))
      .filter((g) => g.nombre);

    if (payload.length === 0) {
      return res.status(400).json({ message: "No hay grupos válidos para insertar" });
    }

    // Insertar ignorando duplicados (ordered:false permite continuar)
    const insertados = await Grupo.insertMany(payload, { ordered: false });

    res.status(201).json({
      message: "Grupos creados correctamente",
      total: insertados.length,
      insertados,
    });
  } catch (error) {
    console.error("Error creando grupos bulk:", error);

    // Si hay duplicados, Mongo suele tirar E11000
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Algunos grupos ya existen (duplicados).",
        detalle: error.message,
      });
    }

    res.status(500).json({ message: "Error creando grupos" });
  }
};