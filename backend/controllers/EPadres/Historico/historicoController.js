const Historico = require("../../../models/EPadres/Historico/HistoricoModel.js");

// Crear registro
const createHistorico = async (req, res) => {
  try {
    const historico = new Historico(req.body);
    const savedHistorico = await historico.save();

    res.status(201).json({
      success: true,
      data: savedHistorico,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Obtener todos
const getHistoricos = async (req, res) => {
  try {
    const historicos = await Historico.find().sort({
      año: -1,
      "estudiante.nombre": 1,
    });

    res.status(200).json({
      success: true,
      total: historicos.length,
      data: historicos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Buscar por documento
const getHistoricoByDocumento = async (req, res) => {
  try {
    const { documento } = req.params;

    const historicos = await Historico.find({
      "estudiante.documento": documento,
    }).sort({
      año: -1,
    });

    res.status(200).json({
      success: true,
      total: historicos.length,
      data: historicos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Buscar por periodo
const getHistoricoByPeriodo = async (req, res) => {
  try {
    const { periodo } = req.params;

    const historicos = await Historico.find({
      año: periodo,
    });

    res.status(200).json({
      success: true,
      data: historicos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Actualizar
const updateHistorico = async (req, res) => {
  try {
    const { id } = req.params;

    const historico = await Historico.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!historico) {
      return res.status(404).json({
        success: false,
        message: "Registro no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: historico,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Eliminar
const deleteHistorico = async (req, res) => {
  try {
    const { id } = req.params;

    const historico = await Historico.findByIdAndDelete(id);

    if (!historico) {
      return res.status(404).json({
        success: false,
        message: "Registro no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Registro eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createHistorico,
  getHistoricos,
  getHistoricoByDocumento,
  getHistoricoByPeriodo,
  updateHistorico,
  deleteHistorico,
};