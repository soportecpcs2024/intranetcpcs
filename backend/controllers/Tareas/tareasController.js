// controllers/Tareas/tareasController.js
const Tarea = require('../../models/Tareas/tareas');

const crearTarea = async (req, res) => {
  try {
    const nuevaTarea = new Tarea(req.body);
    await nuevaTarea.save();
    res.status(201).json(nuevaTarea);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear tarea', error });
  }
};

const obtenerTareas = async (req, res) => {
  try {
    const tareas = await Tarea.find();
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener tareas', error });
  }
};

const actualizarEstadoTarea = async (req, res) => {
  try {
    const tarea = await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(tarea);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar tarea', error });
  }
};

const eliminarTarea = async (req, res) => {
  try {
    await Tarea.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Tarea eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar tarea', error });
  }
};

const obtenerEstadisticas = async (req, res) => {
  try {
    const total = await Tarea.countDocuments();
    const pendientes = await Tarea.countDocuments({ estado: 'Pendiente' });
    const terminadas = await Tarea.countDocuments({ estado: 'Terminado' });
    const cumplidas = await Tarea.countDocuments({ cumplidoATiempo: 'Sí' });
    const noCumplidas = await Tarea.countDocuments({ cumplidoATiempo: 'No' });

    res.json({ total, pendientes, terminadas, cumplidas, noCumplidas });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener estadísticas', error });
  }
};

module.exports = {
  crearTarea,
  obtenerTareas,
  actualizarEstadoTarea,
  eliminarTarea,
  obtenerEstadisticas,
};
