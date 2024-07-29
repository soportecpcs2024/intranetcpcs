// controllers/llegadasTardesController.js
const LlegadasTardes = require('../models/llegadasTardes');
const Usuario = require('../models/Students_datos_globales');

// Agregar fechas de llegadas tarde para un usuario
exports.addLlegadasTardes = async (req, res) => {
  const { fechas, num_identificacion } = req.body;
  try {
    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ num_identificacion });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Buscar o crear el documento de LlegadasTardes para el usuario
    let llegadaTarde = await LlegadasTardes.findOne({ num_identificacion });
    if (llegadaTarde) {
      // Si existe, agregar las fechas nuevas
      llegadaTarde.fechas = [...llegadaTarde.fechas, ...fechas];
    } else {
      // Si no existe, crear uno nuevo
      llegadaTarde = new LlegadasTardes({ num_identificacion, fechas });
    }

    await llegadaTarde.save();
    res.status(201).json(llegadaTarde);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todas las llegadas tardes con información del usuario
exports.getAllLlegadasTardes = async (req, res) => {
  try {
    const llegadasTardes = await LlegadasTardes.find().lean(); // Usa .lean() para trabajar con documentos planos

    // Obtener información adicional del usuario para cada llegada tarde
    const result = [];
    for (const llegada of llegadasTardes) {
      const usuario = await Usuario.findOne({ num_identificacion: llegada.num_identificacion }).lean();
      if (usuario) {
        result.push({
          primer_nombre: usuario.primer_nombre,
          segundo_nombre: usuario.segundo_nombre,
          primer_apellido: usuario.primer_apellido,
          segundo_apellido: usuario.segundo_apellido,
          num_identificacion: usuario.num_identificacion,
          grupo: usuario.grupo,
          grado: usuario.grado,
          fechas: llegada.fechas
           
        });
      }
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Obtener una llegada tarde por ID y mas
exports.getLlegadaTardeById = async (req, res) => {
  try {
    const llegadaTarde = await LlegadasTardes.findById(req.params.id);
    if (!llegadaTarde) {
      return res.status(404).json({ message: 'Llegada tarde no encontrada' });
    }
    
    const usuario = await Usuario.findOne({ num_identificacion: llegadaTarde.num_identificacion }).lean();
    if (usuario) {
      res.status(200).json({
        ...usuario,
        fechas: llegadaTarde.fechas
      });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar las fechas de llegadas tarde para un usuario
exports.updateLlegadaTarde = async (req, res) => {
  const { fechas, num_identificacion } = req.body;
  try {
    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ num_identificacion });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Buscar el documento de LlegadasTardes y actualizarlo
    const llegadaTarde = await LlegadasTardes.findOneAndUpdate(
      { num_identificacion },
      { fechas },
      { new: true } // Retorna el documento actualizado
    ).lean();

    if (!llegadaTarde) {
      return res.status(404).json({ message: 'Llegada tarde no encontrada' });
    }

    res.status(200).json(llegadaTarde);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar una llegada tarde
exports.deleteLlegadaTarde = async (req, res) => {
  try {
    const llegadaTarde = await LlegadasTardes.findByIdAndDelete(req.params.id);
    if (!llegadaTarde) {
      return res.status(404).json({ message: 'Llegada tarde no encontrada' });
    }
    res.status(200).json({ message: 'Llegada tarde eliminada' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
