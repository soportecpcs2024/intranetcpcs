// controllers/asistenciaController.js
const AsistenciaPadres = require('../../models/EPadres/AsistenciaPadresModel');
const EscuelaPadres = require('../../models/EPadres/EscuelaPadresModel');
const Estudiante = require('../../models/EPadres/EstudianteModel');

const crearAsistencia = async (req, res) => {
  try {
    const { estudianteId, escuelaPadresId, asistencias, entregaMaterial, tieneHermano } = req.body;

    if (!estudianteId || !escuelaPadresId) {
      return res.status(400).json({ message: 'Estudiante y escuela son obligatorios' });
    }

    const estudiante = await Estudiante.findById(estudianteId);
    if (!estudiante) return res.status(404).json({ message: 'Estudiante no encontrado' });

    const escuela = await EscuelaPadres.findById(escuelaPadresId);
    if (!escuela) return res.status(404).json({ message: 'Escuela no encontrada' });

    // 🔁 Verificar si ya existe una asistencia para esta combinación
    const existente = await AsistenciaPadres.findOne({ estudianteId, escuelaPadresId });
    if (existente) {
      return res.status(400).json({ message: 'Ya existe asistencia para este estudiante en esta escuela' });
    }

    const nuevaAsistencia = new AsistenciaPadres({
      estudianteId,
      escuelaPadresId,
      asistencias,
      entregaMaterial,
      tieneHermano,
    });

    await nuevaAsistencia.save();

    res.status(201).json({ message: 'Asistencia registrada correctamente', asistencia: nuevaAsistencia });
  } catch (error) {
    console.error('Error al crear asistencia:', error);
    res.status(500).json({ message: 'Error interno al guardar asistencia' });
  }
};


// controllers/asistenciaController.js
const actualizarAsistencia = async (req, res) => {
  try {
    const { id } = req.params; // El ID del registro de asistencia a actualizar
    const { asistencias, entregaMaterial, tieneHermano } = req.body;

    // Busca el registro de asistencia
    const asistencia = await AsistenciaPadres.findById(id);
    if (!asistencia) return res.status(404).json({ message: 'Registro de asistencia no encontrado' });
    
    // Actualiza los campos
    asistencia.asistencias = asistencias;
    asistencia.entregaMaterial = entregaMaterial;
    asistencia.tieneHermano = tieneHermano;

    // Calcula si el estudiante debe recibir certificado (más del 50% de asistencias)
    const totalFechas = asistencia.asistencias.length;
    const totalAsistencias = asistencia.asistencias.filter(a => a.asistio).length;
    asistencia.certificadoOtorgado = totalAsistencias / totalFechas >= 0.4;

    // Guarda la actualización
    await asistencia.save();
    
    res.status(200).json({ message: 'Asistencia actualizada correctamente', asistencia });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el registro de asistencia' });
  }
};


// controllers/asistenciaController.js
const obtenerAsistenciaPorEstudiante = async (req, res) => {
  try {
    const { escuelaPadresId, estudianteId } = req.params;

    const asistencia = await AsistenciaPadres.findOne({ 
      escuelaPadresId, 
      estudianteId 
    }).populate('estudianteId', 'primer_nombre primer_apellido grupo');

    if (!asistencia) {
      // ✅ Retorna 200 con null o mensaje controlado
      return res.status(200).json(null);
    }

    return res.status(200).json(asistencia);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener el registro de asistencia' });
  }
};


const asistenciasUnificadas = async(req,res) =>{
  try {
      const asistencias = await AsistenciaPadres.find()
      .populate('estudianteId', 'nombre documento grupo grado hermanos')
      .populate('escuelaPadresId', 'nombre direccion contacto');

    const dataUnificada = asistencias.map(a => {
      const estudiante = a.estudianteId || {};
      return {
        asistenciaId: a._id,
        escuela: a.escuelaPadresId,
        estudiante: {
          _id: estudiante._id,
          nombre: estudiante.nombre || '',
          documento: estudiante.documento || '',
          grupo: estudiante.grupo || '',
          grado: estudiante.grado || '',
          hermanos: estudiante.hermanos || false,
        },
        asistencias: a.asistencias,
        entregaMaterial: a.entregaMaterial,
        tieneHermano: a.tieneHermano,
        certificadoOtorgado: a.certificadoOtorgado,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      };
    });
      res.status(200).json(dataUnificada);
    
  } catch (error) {
     console.error('Error al obtener asistencias unificadas:', error);
    res.status(500).json({ message: 'Error interno al obtener las asistencias' });
  }

};
 

module.exports = { crearAsistencia, actualizarAsistencia, obtenerAsistenciaPorEstudiante, asistenciasUnificadas };

 
