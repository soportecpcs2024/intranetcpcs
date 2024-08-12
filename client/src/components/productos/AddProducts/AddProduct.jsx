import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../../contexts/ProductContext"; // Asegúrate de usar la ruta correcta
import "./AddProduct.css"; // Asegúrate de que el archivo CSS esté creado y enlazado

const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: "",
    brand: "",
    sku: "",
    category: "",
    quantity: "",
    model: "",
    dimensions: "",
    price: "",
    color: "",
    description: "",
    image: null, // Guarda el archivo directamente
  });

  const [errors, setErrors] = useState({
    name: "",
    brand: "",
    sku: "",
    category: "",
    quantity: "",
    model: "",
    dimensions: "",
    price: "",
    color: "",
    description: "",
    image: "",
  });

  const { createProduct } = useProducts(); // Accede a createProduct desde el contexto
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductData((prevData) => ({
      ...prevData,
      image: file, // Guarda el archivo directamente
    }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    Object.keys(productData).forEach((key) => {
      if (key !== "image" && !productData[key]) {
        newErrors[key] = `Please add a ${key}`;
        valid = false;
      }
    });

    if (!productData.image) {
      newErrors.image = "Please upload an image";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Asegúrate de que el archivo se incluya en productData
      await createProduct(productData);
      navigate("/admin/administracion/productList");
    } catch (error) {
      console.error("Error creating product", error);
    }
  };

  return (
    <div className="add-product-container">
      <h3>Adicionar Nuevo Producto</h3>
      <form onSubmit={handleSubmit} className="add-product-form">
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={productData.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error-message">{errors.name}</p>}

        <input
          type="text"
          name="brand"
          placeholder="Marca"
          value={productData.brand}
          onChange={handleChange}
        />
        {errors.brand && <p className="error-message">{errors.brand}</p>}

        <input
          type="text"
          name="sku"
          placeholder="Referencia"
          value={productData.sku}
          onChange={handleChange}
        />
        {errors.sku && <p className="error-message">{errors.sku}</p>}

        <input
          type="text"
          name="category"
          placeholder="Categoría"
          value={productData.category}
          onChange={handleChange}
        />
        {errors.category && <p className="error-message">{errors.category}</p>}

        <input
          type="number"
          name="quantity"
          placeholder="Cantidad"
          value={productData.quantity}
          onChange={handleChange}
        />
        {errors.quantity && <p className="error-message">{errors.quantity}</p>}

        <input
          type="text"
          name="model"
          placeholder="Modelo"
          value={productData.model}
          onChange={handleChange}
        />
        {errors.model && <p className="error-message">{errors.model}</p>}

        <input
          type="text"
          name="dimensions"
          placeholder="Dimensiones"
          value={productData.dimensions}
          onChange={handleChange}
        />
        {errors.dimensions && <p className="error-message">{errors.dimensions}</p>}

        <input
          type="number"
          name="price"
          placeholder="Precio"
          value={productData.price}
          onChange={handleChange}
        />
        {errors.price && <p className="error-message">{errors.price}</p>}

        <input
          type="text"
          name="color"
          placeholder="Color"
          value={productData.color}
          onChange={handleChange}
        />
        {errors.color && <p className="error-message">{errors.color}</p>}

        <textarea
          name="description"
          placeholder="Descripción"
          value={productData.description}
          onChange={handleChange}
        ></textarea>
        {errors.description && <p className="error-message">{errors.description}</p>}

        <input
          type="file"
          name="image"
          onChange={handleImageChange}
        />
        {errors.image && <p className="error-message">{errors.image}</p>}

        <button type="submit" className="submit-button">
          Adicionar Producto
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
