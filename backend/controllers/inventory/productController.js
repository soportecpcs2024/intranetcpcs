const asyncHandler = require("express-async-handler");
const Product = require("../../models/inventory/productModel");
const { fileSizeFormatter } = require("../../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

// Create Product
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    brand,
    sku,
    category,
    area,
    model,
    dimensions,
    price,
    color,
    description,
    purchase_date,
    useful_life
  } = req.body;

  // Verificar si el producto con el mismo nombre o modelo ya existe
  const existingProduct = await Product.findOne({ name });
  const existingProductModel = await Product.findOne({ model });

  if (existingProduct || existingProductModel) {
    res.status(400).send({ msg: "No puedes registrar un producto ya existente" });
    return;
  }

  // Manejar la carga de la imagen si se proporciona
  let fileData = {};
  if (req.file) {
    try {
      const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Inventory cpcs App",
        resource_type: "image",
      });

      fileData = {
        fileName: req.file.originalname,
        filePath: uploadedFile.secure_url,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2),
      };
    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded");
    }
  }

  const product = await Product.create({
    name,
    brand,
    sku,
    category,
    area,
    model,
    dimensions,
    price,
    color,
    description,
    purchase_date,
    useful_life,
    image: fileData,
  });

  res.status(201).json(product);
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    brand,
    sku,
    category,
    area,
    model,
    dimensions,
    price,
    color,
    description,
    purchase_date,
    useful_life
  } = req.body;
  const { id } = req.params;

  // Buscar el producto existente por su ID
  const product = await Product.findById(id);

  // Si el producto no existe
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Manejar la carga de la imagen si se proporciona
  let fileData = product.image; // Usar la imagen existente por defecto
  if (req.file) {
    try {
      const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Inventory cpcs App",
        resource_type: "image",
      });

      fileData = {
        fileName: req.file.originalname,
        filePath: uploadedFile.secure_url,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2),
      };
    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded");
    }
  }

  // Actualizar solo los campos proporcionados; mantener los existentes si no se proporcionan
  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    {
      name: name || product.name,
      brand: brand || product.brand,
      sku: sku || product.sku,
      category: category || product.category,
      area: area || product.area,
      model: model || product.model,
      dimensions: dimensions || product.dimensions,
      price: price || product.price,
      color: color || product.color,
      description: description || product.description,
      purchase_date: purchase_date || product.purchase_date,
      useful_life: useful_life || product.useful_life,
      image: fileData,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(updatedProduct);
});

// Get all Products
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
});

// Get a single Product
const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json(product);
});

// Delete a Product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Use deleteOne to remove the product
  await product.deleteOne();

  res.status(200).json({ message: "Product removed" });
});

module.exports = {
  updateProduct,
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
};
