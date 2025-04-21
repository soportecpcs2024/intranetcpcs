const StudentNotes = require('../models/student_notes_sheet_model');

// Controlador para obtener todas las notas de estudiantes
const getAllNotes = async (req, res) => {
  try {
    const studentNotes = await StudentNotes.find();
    res.json(studentNotes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener notas de estudiantes' });
  }
};

// Controlador para obtener una nota de estudiante por su ID
const getNoteById = async (req, res) => {
  const { id } = req.params;
  try {
    const studentNote = await StudentNotes.findById(id);
    if (!studentNote) {
      return res.status(404).json({ error: 'Nota de estudiante no encontrada' });
    }
    res.json(studentNote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener la nota de estudiante por ID' });
  }
};

// Controlador para crear una nueva nota de estudiante
const createNote = async (req, res) => {
  const newNoteData = req.body;
  try {
    const newStudentNote = new StudentNotes(newNoteData);
    const savedNote = await newStudentNote.save();
    res.status(201).json(savedNote); // Devuelve el documento guardado con el status 201 (Created)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear una nueva nota de estudiante' });
  }
};

// Controlador para actualizar una nota de estudiante por su ID
const updateNote = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const updatedNote = await StudentNotes.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedNote) {
      return res.status(404).json({ error: 'Nota de estudiante no encontrada para actualizar' });
    }
    res.json(updatedNote);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar la nota de estudiante' });
  }
};

// Controlador para eliminar una nota de estudiante por su ID
const deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedNote = await StudentNotes.findByIdAndDelete(id);
    if (!deletedNote) {
      return res.status(404).json({ error: 'Nota de estudiante no encontrada para eliminar' });
    }
    res.json({ message: 'Nota de estudiante eliminada exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar la nota de estudiante' });
  }
};


// Controlador para obtener todas las notas de estudiantes filtradas por nivel
const getAllNotesSection = async (req, res) => {
  try {
    const { nivel } = req.query;

    // Define los grupos según el nivel
    const niveles = {
      preescolar: ["1. A ","1. B "],
      primaria: ["2. A", "2. B ", "2. C", "3. A ","3. B ", "4. A ", "4. B ","4. C","5. A ","5. B "],
      secundaria: ["6. A","6. B", "7. A", "7. B", "8. A","8. B", ],
      media: ["9. A", "9. B", "9. B1", "10. A","10. B", "11. A ", "11. B"],
      
    };

    let filtro = {};

    if (nivel && niveles[nivel]) {
      filtro.grupo = { $in: niveles[nivel] };
    }

    const studentNotes = await StudentNotes.find(filtro);
    res.json(studentNotes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener notas de estudiantes' });
  }
};

// Controlador para obtener el promedio por materia y grupo
const getPromedioPorMateriaYGrupo = async (req, res) => {
  try {
    const { nivel } = req.query;  // Se puede filtrar por nivel si se pasa como query

    // Definir los grupos por nivel
    const niveles = {
      preescolar: ["1. A ", "1. B "],
      primaria: ["2. A", "2. B ", "2. C", "3. A ", "3. B ", "4. A ", "4. B ", "4. C", "5. A ", "5. B "],
      secundaria: ["6. A", "6. B", "7. A", "7. B", "8. A", "8. B"],
      media: ["9. A", "9. B", "9. B1", "10. A", "10. B", "11. A ", "11. B"]
    };

    let filtro = {};

    // Si el nivel es proporcionado en la query, aplicar el filtro correspondiente
    if (nivel && niveles[nivel]) {
      filtro.grupo = { $in: niveles[nivel] };
    }

    // Buscar las notas de los estudiantes según el filtro de nivel (si se aplica)
    const studentNotes = await StudentNotes.find(filtro);

    if (studentNotes.length === 0) {
      return res.status(404).json({ error: 'No se encontraron notas de estudiantes' });
    }

    // Inicializar variables para los totales de las materias y los conteos
    const materias = [
      'ciencias_naturales', 'fisica', 'quimica', 'ciencias_politicas_economicas',
      'ciencias_sociales', 'civica_y_constitucion', 'educacion_artistica', 'educacion_cristiana',
      'educacion_etica', 'educacion_fisica', 'filosofia', 'idioma_extranjero', 
      'lengua_castellana', 'matematicas', 'tecnologia'
    ];

    // Crear un objeto para almacenar los totales de cada materia por grupo
    let promediosPorGrupo = {};

    // Procesar las notas de los estudiantes
    studentNotes.forEach(note => {
      const grupo = note.grupo;

      // Inicializar el grupo si no existe en el objeto de promedios
      if (!promediosPorGrupo[grupo]) {
        promediosPorGrupo[grupo] = {};

        // Inicializar las materias para este grupo
        materias.forEach(materia => {
          promediosPorGrupo[grupo][materia] = { suma: 0, cantidad: 0 };
        });
      }

      // Sumar las notas de cada materia para el grupo correspondiente
      materias.forEach(materia => {
        if (note[materia] !== undefined && note[materia] !== null) {
          promediosPorGrupo[grupo][materia].suma += note[materia];
          promediosPorGrupo[grupo][materia].cantidad++;
        }
      });
    });

   // Calcular el promedio por materia para cada grupo
let promediosFinales = {};

for (let grupo in promediosPorGrupo) {
  promediosFinales[grupo] = {};
  for (let materia in promediosPorGrupo[grupo]) {
    const { suma, cantidad } = promediosPorGrupo[grupo][materia];
    if (cantidad > 0) {
      const promedio = parseFloat((suma / cantidad).toFixed(1));
      // Solo agregar si el promedio es mayor a 0
      if (promedio > 0  && promedio < 4) {
        promediosFinales[grupo][materia] = promedio;
      }
    }
    // Si cantidad es 0, no se agrega la materia
  }

  // Eliminar el grupo si no tiene ninguna materia con promedio válido
  if (Object.keys(promediosFinales[grupo]).length === 0) {
    delete promediosFinales[grupo];
  }
}

    // Devolver los promedios por grupo y materia
    res.json(promediosFinales);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al calcular los promedios por grupo' });
  }
};




module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  getAllNotesSection,
  getPromedioPorMateriaYGrupo
  
};
