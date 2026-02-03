const armarFacturaCompleta = async (facturaDoc) => {
  // Asegura objeto plano
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

  // 2) Clases (resolver todas en un solo query)
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
      claseId: c.claseId, // id real guardado
      claseInfo: claseInfo
        ? {
            _id: claseInfo._id,
            nombre: claseInfo.nombre,
            cod: claseInfo.cod,
            dia: claseInfo.dia,
            hora: claseInfo.hora,
          }
        : null,
      claseWarning: !claseInfo
        ? `No se encontró claseId=${c.claseId}`
        : null,
    };
  });

  // 3) Respuesta final
  return {
    ...factura,
    estudiante: estudiante || null,
    clases: clasesCompleta,
    warnings: [
      ...(estudianteWarning ? [estudianteWarning] : []),
      // warnings de clases que no existan
      ...clasesCompleta
        .filter((c) => c.claseWarning)
        .map((c) => c.claseWarning),
    ],
  };
};
