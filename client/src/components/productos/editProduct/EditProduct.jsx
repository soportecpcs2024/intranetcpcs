// src/components/EditProduct/EditProduct.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../../../contexts/ProductContext";
import "./editProduct.css"; // Asegúrate de tener el archivo CSS vinculado

const EditProduct = () => {
  const { id } = useParams(); // Obtiene el id del producto de los parámetros de la URL
  const { products, fetchProducts, updateProduct, loading, error } = useProducts(); // Obtiene los productos, función de actualización y estado del contexto
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    brand:"",
    sku:"",
    category: "",
    quantity: "",
    model:"",
    dimensions:"",
    price: "",
    color: "",
    description: ""
    // Añade aquí otros campos que necesites
  });
  const navigate = useNavigate(); // Instancia useNavigate para la navegación

  useEffect(() => {
    if (!loading && products.length > 0) {
      // Busca el producto si los productos ya se han cargado
      const foundProduct = products.find((p) => p._id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        setFormData({
          name: foundProduct.name,
          brand:foundProduct.brand,
          sku:foundProduct.sku,
          category: foundProduct.category,
          quantity: foundProduct.quantity,
          model: foundProduct.model,
          price: foundProduct.price,
          color: foundProduct.color,
          description: foundProduct.description,
          // Inicializa otros campos aquí
        });
      }
    }
  }, [id, products, loading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProduct(id, formData);
    navigate("/admin/administracion/productList"); // Navega de vuelta a la lista de productos
  };

  if (loading) {
    return <p>Loading...</p>; // Muestra un mensaje de carga si los productos están cargando
  }

  if (error) {
    return <p>Error loading product: {error.message}</p>; // Muestra un mensaje de error si hay un problema al cargar los productos
  }

  if (!product) {
    return <p>Product not found.</p>; // Muestra un mensaje si no se encuentra el producto
  }

  return (
    <div className="edit-product-container">
      <h3>Editar  Producto</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre :</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Modelo :</label>
          <input
            type="text"
            name="category"
            value={formData.model}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        {/* Añade aquí otros campos según sea necesario */}
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProduct;

