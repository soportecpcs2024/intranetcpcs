const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
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
    quantity: {
      type: String,
      required: [true, "Please add a quantity"],
      trim: true,
    },
    model: {
      type: String,
      default: "",
      trim: true,
    },
    dimensions: {
      type: String,
      required: [true, "Please add a dimensions"],
      trim: true,
    },
    price: {
      type: String,
      required: [true, "Please add a price"],
      trim: true,
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
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;