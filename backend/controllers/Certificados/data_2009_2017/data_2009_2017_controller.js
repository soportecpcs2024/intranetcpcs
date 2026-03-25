const Data_certificados_2009_2017 = require('../../../models/Certificados/data_2009-2017/data_09_17_model');

// Limpiar texto
const limpiarTexto = (valor) => {
  if (typeof valor !== 'string') return valor;
  return valor.trim();
};

// Convertir a número
const convertirNumero = (valor, porDefecto = 0) => {
  if (valor === null || valor === undefined || valor === '') return porDefecto;

  const numero = Number(String(valor).trim());
  return isNaN(numero) ? porDefecto : numero;
};

// Limpiar objeto plano
const limpiarObjeto = (obj = {}) => {
  const limpio = {};

  for (const key in obj) {
    limpio[key] = limpiarTexto(obj[key]);
  }

  return limpio;
};

// Limpiar materias
const limpiarMaterias = (materias = []) => {
  if (!Array.isArray(materias)) return [];

  return materias.map((materia) => ({
    NombreArea: limpiarTexto(materia.NombreArea),
    conceptoNum: convertirNumero(materia.conceptoNum),
    NombreConcepto: limpiarTexto(materia.NombreConcepto),
    Intensidad: convertirNumero(materia.Intensidad),
    HorasAno: convertirNumero(materia.HorasAno),
    HorasDictadas: convertirNumero(materia.HorasDictadas),
    faltas: convertirNumero(materia.faltas, 0),
    FechaRetiro: limpiarTexto(materia.FechaRetiro || ''),
    Escala_valorativa: limpiarTexto(materia.Escala_valorativa)
  }));
};

// Crear estudiante histórico
const crearEstudiante = async (req, res) => {
  try {
    const body = req.body;

    const datosPrincipales = limpiarObjeto({
      LibroCalificaciones: body.LibroCalificaciones,
      Nombre: body.Nombre,
      Documento: body.Documento,
      Identificacion: body.Identificacion || body.NumeroIdentificacion,
      Grado: body.Grado,
      Seccion: body.Seccion,
      PeriodoAcademico: body.PeriodoAcademico,
      NumeroMatricula: body.NumeroMatricula
    });

    const materias = limpiarMaterias(body.materias);

    if (
      !datosPrincipales.LibroCalificaciones ||
      !datosPrincipales.Nombre ||
      !datosPrincipales.Documento ||
      !datosPrincipales.Identificacion ||
      !datosPrincipales.Grado ||
      !datosPrincipales.Seccion ||
      !datosPrincipales.PeriodoAcademico ||
      !datosPrincipales.NumeroMatricula
    ) {
      return res.status(400).json({
        ok: false,
        message: 'Faltan campos obligatorios del estudiante'
      });
    }

    if (!materias.length) {
      return res.status(400).json({
        ok: false,
        message: 'Debe enviar al menos una materia'
      });
    }

    const existe = await Data_certificados_2009_2017.findOne({
      Identificacion: datosPrincipales.Identificacion,
      PeriodoAcademico: datosPrincipales.PeriodoAcademico
    });

    if (existe) {
      return res.status(400).json({
        ok: false,
        message: 'Ya existe un registro para este estudiante en ese año/período'
      });
    }

    const nuevoRegistro = new Data_certificados_2009_2017({
      ...datosPrincipales,
      materias
    });

    const guardado = await nuevoRegistro.save();

    return res.status(201).json({
      ok: true,
      message: 'Estudiante creado correctamente',
      data: guardado
    });
  } catch (error) {
    console.error('Error al crear estudiante:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        ok: false,
        message: 'Ya existe un registro con la misma identificación y período'
      });
    }

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Listar datos por identificación
const obtenerPorIdentificacion = async (req, res) => {
  try {
    const identificacion = limpiarTexto(req.params.id);

    if (!identificacion) {
      return res.status(400).json({
        ok: false,
        message: 'La identificación es obligatoria'
      });
    }

    const registros = await Data_certificados_2009_2017.find({
      Identificacion: identificacion
    }).sort({ PeriodoAcademico: 1 });

    if (!registros.length) {
      return res.status(404).json({
        ok: false,
        message: 'No se encontraron registros para esta identificación'
      });
    }

    return res.status(200).json({
      ok: true,
      total: registros.length,
      data: registros
    });
  } catch (error) {
    console.error('Error al obtener datos por identificación:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  crearEstudiante,
  obtenerPorIdentificacion
};