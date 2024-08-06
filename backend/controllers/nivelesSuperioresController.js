const StudentNivelSuperior = require('../models/student_notes_sheet_model');

// Controlador para obtener todas las notas de estudiantes donde todos los valores sean mayores o iguales a 4
const getAllNotesNS = async (req, res) => {
  try {
    // Define los criterios de filtro para cada materia
    const filterCriteria = {
      $expr: {
        $and: [
          { $gte: ["$ciencias_naturales", 4] },
          { $gte: ["$fisica", 4] },
          { $gte: ["$quimica", 4] },
          { $gte: ["$ciencias_politicas_economicas", 4] },
          { $gte: ["$ciencias_sociales", 4] },
          { $gte: ["$civica_y_constitucion", 4] },
          { $gte: ["$educacion_artistica", 4] },
          { $gte: ["$educacion_cristiana", 4] },
          { $gte: ["$educacion_etica", 4] },
          { $gte: ["$educacion_fisica", 4] },
          { $gte: ["$filosofia", 4] },
          { $gte: ["$idioma_extranjero", 4] },
          { $gte: ["$lengua_castellana", 4] },
          { $gte: ["$matematicas", 4] },
          { $gte: ["$tecnologia", 4] }
        ]
      }
    };

    // Contar el número de documentos que cumplen con los criterios de filtro
    const count = await StudentNivelSuperior.countDocuments(filterCriteria);

    // Obtener los documentos que cumplen con los criterios de filtro
    const studentNotes = await StudentNivelSuperior.find(filterCriteria).select({
      grupo: 1,
      nombre: 1,
      periodo: 1,
      ciencias_naturales: 1,
      fisica: 1,
      quimica: 1,
      ciencias_politicas_economicas: 1,
      ciencias_sociales: 1,
      civica_y_constitucion: 1,
      educacion_artistica: 1,
      educacion_cristiana: 1,
      educacion_etica: 1,
      educacion_fisica: 1,
      filosofia: 1,
      idioma_extranjero: 1,
      lengua_castellana: 1,
      matematicas: 1,
      tecnologia: 1
    });

    // Enviar la respuesta con los resultados y el conteo
    res.json({ count, studentNotes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener notas de estudiantes' });
  }
};

module.exports = {
  getAllNotesNS,
};
