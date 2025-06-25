// POST /api/asistencias/init/:escuelaId
const inicializarAsistencia = async (req, res) => {
  const { escuelaId } = req.params;
  const escuela = await EscuelaPadres.findById(escuelaId);
  const estudiantes = await Estudiante.find({ grupo: escuela.grupo });

  const asistencias = await Promise.all(estudiantes.map(async (est) => {
    const registro = new AsistenciaPadres({
      estudianteId: est._id,
      escuelaId: escuelaId,
      asistencias: escuela.fechas.map(fecha => ({ fecha, presente: false }))
    });
    return registro.save();
  }));

  res.status(201).json(asistencias);
};

// PATCH /api/asistencias/:id
const actualizarAsistencia = async (req, res) => {
  const { fecha, presente } = req.body;
  const asistencia = await AsistenciaPadres.findById(req.params.id);

  asistencia.asistencias = asistencia.asistencias.map(a =>
    a.fecha.toISOString() === new Date(fecha).toISOString()
      ? { ...a.toObject(), presente }
      : a
  );

  await asistencia.save();
  res.json(asistencia);
};
