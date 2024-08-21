const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: String, required: true }
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
      type: imageSchema, // Actualizado para usar el esquema de imagen
      default: {}
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
