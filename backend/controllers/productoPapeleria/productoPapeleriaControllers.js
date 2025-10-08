const ProductoPapeleria = require("../../models/ProductoPapeleria/productoPapeleriaModel");

// Crear productoPapeleria
exports.crearProductoPapeleria = async (req, res) => {
  try {
    const productoPapeleria = new ProductoPapeleria(req.body);
    await productoPapeleria.save();
    res.status(201).json(productoPapeleria);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todos los productosPapeleria
exports.obtenerProductosPapeleria = async (req, res) => {
  try {
    const productosPapeleria = await ProductoPapeleria.find();
    res.json(productosPapeleria);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener un productoPapeleria por ID
exports.obtenerProductoPapeleriaPorId = async (req, res) => {
  try {
    const productoPapeleria = await ProductoPapeleria.findById(req.params.id);
    if (!productoPapeleria) {
      return res.status(404).json({ message: 'Producto de papelería no encontrado' });
    }
    res.json(productoPapeleria);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar un productoPapeleria por ID
exports.actualizarProductosPapeleriaporId = async (req, res) => {
  try {
    const productoPapeleria = await ProductoPapeleria.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!productoPapeleria) return res.status(404).json({ message: 'Producto Papeleria no encontrado' });
    res.json(productoPapeleria);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar un productoPapeleria por ID
exports.eliminarProductosPapeleria = async (req, res) => {
  try {
    const productoPapeleria = await ProductoPapeleria.findByIdAndDelete(req.params.id);
    if (!productoPapeleria) return res.status(404).json({ message: 'Producto Papeleria no encontrado' });
    res.json({ message: 'Producto Papeleria eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
