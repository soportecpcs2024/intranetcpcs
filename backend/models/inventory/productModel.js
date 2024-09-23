const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: String, required: true },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      default: "Brand",
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      default: "SKU",
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      trim: true,
    },
    model: {
      type: String,
      default: "",
      trim: true,
    },
    dimensions: {
      type: String,
      required: [true, "Please add dimensions"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
    },
    color: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      trim: true,
    },
    image: {
      type: imageSchema, // Esquema de imagen
      default: {},
    },
    purchase_date: {
      type: Date,
      required: true,
    },
    useful_life: {
      type: Number,
      required: [true, "Please add a useful life"],
      min: [1, "Useful life must be at least 1 year"],
    },
    depreciation: {
      type: Number,
      default: 0, // Inicializamos en 0 por defecto
    },
  },
  {
    timestamps: true,
  }
);

// Método pre-save para calcular la depreciación automáticamente
productSchema.pre("save", function (next) {
  if (this.price && this.useful_life) {
    this.depreciation = (this.price / this.useful_life).toFixed(2); // Calcular depreciación
  }
  next();
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
