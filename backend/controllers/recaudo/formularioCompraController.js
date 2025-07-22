const FormularioCompra = require('../../models/recaudo/FormularioCompra');

// Función para calcular el costo según el tipo de formulario
const calcularCosto = (tipoFormulario) => {
  switch (tipoFormulario) {
    case '2026':
      return 65000;
    case '2025':
      return 60000;
    case 'Open House':
      return 30000;
    default:
      return 0;
  }
};

// Crear nuevo registro
const crearFormulario = async (req, res) => {
  try {
    const { nombreEstudiante, gradoPostula, tipoFormulario, tipoPago } = req.body;

    // Validación básica
    if (!nombreEstudiante || !gradoPostula ||!tipoFormulario || !tipoPago) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    const costo = calcularCosto(tipoFormulario);
    if (costo === 0) {
      return res.status(400).json({ error: 'Tipo de formulario inválido.' });
    }

    const nuevoFormulario = new FormularioCompra({
      nombreEstudiante,
      gradoPostula,
     
      tipoFormulario,
      tipoPago,
      costo,
    });

    const guardado = await nuevoFormulario.save();
    res.status(201).json(guardado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los formularios
const obtenerFormularios = async (req, res) => {
  try {
    const formularios = await FormularioCompra.find().sort({ fechaCompraFormulario: -1 });
    res.json(formularios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un formulario por ID
const obtenerFormularioPorId = async (req, res) => {
  try {
    const formulario = await FormularioCompra.findById(req.params.id);
    if (!formulario) return res.status(404).json({ mensaje: 'Formulario no encontrado.' });
    res.json(formulario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un formulario
const actualizarFormulario = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.body.tipoFormulario) {
      const nuevoCosto = calcularCosto(req.body.tipoFormulario);
      if (nuevoCosto === 0) {
        return res.status(400).json({ error: 'Tipo de formulario inválido.' });
      }
      updateData.costo = nuevoCosto;
    }

    const actualizado = await FormularioCompra.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!actualizado) return res.status(404).json({ mensaje: 'Formulario no encontrado.' });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un formulario
const eliminarFormulario = async (req, res) => {
  try {
    const eliminado = await FormularioCompra.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ mensaje: 'Formulario no encontrado.' });
    res.json({ mensaje: 'Formulario eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  crearFormulario,
  obtenerFormularios,
  obtenerFormularioPorId,
  actualizarFormulario,
  eliminarFormulario,
};
