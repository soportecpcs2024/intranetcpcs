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
    const tarea = await Tarea.findById(req.params.id);
    if (!tarea) {
      return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    }

    // Si el estado se cambia a "Terminado", se establece la fecha de terminación y el cumplimiento
    if (req.body.estado === 'Terminado') {
      req.body.fechaTerminacion = new Date();

      const fechaLimite = new Date(tarea.fechaLimite);
      const fechaTerminacion = new Date(req.body.fechaTerminacion);

      req.body.cumplimiento = fechaTerminacion <= fechaLimite ? 'Eficiente' : 'Tardío';
    }

    const tareaActualizada = await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(tareaActualizada);
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



module.exports = {
  crearTarea,
  obtenerTareas,
  actualizarEstadoTarea,
  eliminarTarea
   
};
