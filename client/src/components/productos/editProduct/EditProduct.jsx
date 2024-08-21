import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../../../contexts/ProductContext";
import "./editProduct.css";

const EditProduct = () => {
  const { id } = useParams();
  const { products, fetchProducts, updateProduct, loading, error } = useProducts();
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    sku: "",
    category: "",
    model: "",
    dimensions: "",
    price: "",
    color: "",
    description: "",
    quantity: "" // Añadido campo de cantidad
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && products.length > 0) {
      const foundProduct = products.find((p) => p._id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setFormData({
          name: foundProduct.name,
          brand: foundProduct.brand,
          sku: foundProduct.sku,
          category: foundProduct.category,
          model: foundProduct.model,
          dimensions: foundProduct.dimensions,
          price: foundProduct.price,
          color: foundProduct.color,
          description: foundProduct.description,
          quantity: foundProduct.quantity || "" // Asegúrate de incluir todos los campos
        });
      }
    } else {
      fetchProducts(); // Fetch products if not already loaded
    }
  }, [id, products, loading, fetchProducts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProduct = {
      ...formData,
      price: parseFloat(formData.price), // Asegúrate de convertir el precio a número
      quantity: parseInt(formData.quantity, 10) // Asegúrate de convertir la cantidad a número
    };
    updateProduct(id, updatedProduct);
    navigate("/admin/administracion/productList");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading product: {error.message}</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div className="edit-product-container">
      <h3>Editar Producto</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Marca:</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>SKU:</label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Categoría:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Modelo:</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Dimensiones:</label>
          <input
            type="text"
            name="dimensions"
            value={formData.dimensions}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Precio:</label>
          <input
            type="number" // Cambiado a number
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>
       
        
        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditProduct;
