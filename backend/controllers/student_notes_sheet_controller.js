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

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
};
