const AsistenciaEstudiantes = require('../../models/AsistenciaEstudiantes/asistenciaEstudiantesModel');
const funcionesFechaHora = require('../../utils/funcionesFechaHora');
const Estudiante = require('../../models/recaudo/EstudianteRecaudo');


exports.mostrarListaGrupo = async (req, res) => {
  try {
    const { grupo } = req.query;

    if (typeof grupo !== "string" || grupo.trim() === "") {
      return res.status(400).json({
        message: "Debes proporcionar un grupo."
      });
    }

    const grupoLimpio = grupo.toUpperCase().trim();

    const listaEstudiantes = await Estudiante.find({
      grado: grupoLimpio
    });

    if (listaEstudiantes.length === 0) {
      return res.status(404).json({
        message: "Grupo no encontrado."
      });
    }

    const { asistenciaTomada, message } =
      await verificarTomaAsistencia(grupoLimpio);

    return res.status(200).json({
      lista: listaEstudiantes,
      asistenciaTomada,
      message
    });
  } catch (error) {
    console.error("Error obteniendo el grupo:", error);

    return res.status(500).json({
      message: "Error al obtener los estudiantes."
    });
  }
};

exports.guardarAsistenciaDiaria = async (req, res) => {
        try {
            const listaEstudiantes = req.body;
            const fechaHoy = funcionesFechaHora.obtenerFechaDeHoy();

            if (!listaEstudiantes || listaEstudiantes.length === 0) {
                return res.status(404).json({ message: "La lista de estudiantes no puede estar vacía." });
            }

            const diaSemana = fechaHoy.getUTCDay();
            const hora = funcionesFechaHora.obtenerHora();
            if (diaSemana === 0 || diaSemana === 6) {
                return res.status(403).json({ message: "No se permite registrar asistencia los fines de semana." });
            }

            if (diaSemana != 5 && (hora < 7 || hora >= 15)) {
                return res.status(403).json({ message: "No se permite registrar fuera de la jornada escolar." });
            }

            if (diaSemana === 5 && (hora < 7 || hora >= 13)) {
                return res.status(403).json({ message: "No se permite registrar fuera de la jornada escolar." });
            }
        
            const asistenciaParaGuardar = listaEstudiantes.map(estudiante => {
                return {
                    updateOne: {
                        filter: {
                            estudianteId: estudiante._id,
                            grupo: estudiante.grupo,
                            fecha: fechaHoy
                        },
                        update: {
                            $set: {
                                estado: estudiante.estado,
                                observacion: estudiante.observacion || ""
                            }
                        },
                        upsert: true
                    }
                };
            });

            console.log("Ya vamos a guardar..... 🥶")

            const resultado = await AsistenciaEstudiantes.bulkWrite(asistenciaParaGuardar);

            console.log(`Operación exitosa 😎. Creados: ${resultado.upsertedCount}, Actualizados: ${resultado.modifiedCount}`);

            return resultado.upsertedCount != 0 ? res.status(200).json({ message: "Asistencia guardada correctamente." }) : res.status(200).json({ message: "Asistencia actualizada correctamente." })

        } catch (error) {
            return res.status(500).json({ message: "Error al guardar la asistencia." });
        }
    }

    const verificarTomaAsistencia = async (grupo) => {
        try {
            const fechaHoy = funcionesFechaHora.obtenerFechaDeHoy();

            const asistenciaTomada = await AsistenciaEstudiantes.findOne({
                grupo: grupo,
                fecha: fechaHoy
            })
            return { asistenciaTomada: asistenciaTomada, message: asistenciaTomada ? 'Asistencia tomada.' : 'Asistencia no tomada.'}
        } catch (error) {
            return res.status(500).json({ message: "Error al verificar la asistencia del grupo." });
        }
    }

