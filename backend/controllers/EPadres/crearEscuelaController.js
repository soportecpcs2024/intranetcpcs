// POST /api/escuelas
const crearEscuela = async (req, res) => {
  const { nombre, grupo, fechas } = req.body;
  if (!nombre || !grupo || !fechas || fechas.length < 3 || fechas.length > 9) {
    return res.status(400).json({ mensaje: 'Datos inválidos' });
  }
  const escuela = new EscuelaPadres({ nombre, grupo, fechas });
  await escuela.save();
  res.status(201).json(escuela);
};
