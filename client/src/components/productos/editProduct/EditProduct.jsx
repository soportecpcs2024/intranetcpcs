import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../../../contexts/ProductContext";
import "./editProduct.css";

const EditProduct = () => {
  const { id } = useParams();
  const { products, fetchProducts, updateProduct, loading, error } =
    useProducts();
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    sku: "",
    category: "",
    area: "",
    model: "",
    dimensions: "",
    price: "",
    color: "",
    description: "",
    quantity: "",
    purchase_date: "",
    useful_life: "", // Añadido campo de vida útil
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
          area: foundProduct.area,
          model: foundProduct.model,
          dimensions: foundProduct.dimensions,
          price: foundProduct.price,
          color: foundProduct.color,
          description: foundProduct.description,
          quantity: foundProduct.quantity || "",
          purchase_date: new Date(foundProduct.purchase_date)
            .toISOString()
            .split("T")[0], // Formatear la fecha para el input
          useful_life: foundProduct.useful_life || "", // Asegúrate de incluir todos los campos
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
      price: parseFloat(formData.price), // Convertir el precio a número
      quantity: parseInt(formData.quantity, 10), // Convertir la cantidad a número
      purchase_date: new Date(formData.purchase_date).toISOString(), // Convertir la fecha a ISO string
      useful_life: parseInt(formData.useful_life, 10), // Convertir la vida útil a número
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
          <label>Área:</label>
          <select name="area" value={formData.area} onChange={handleChange}>
            <option value="">Selecciona un área</option>
            <option value="Tecnología">Tecnología</option>
            <option value="Inmueble">Inmueble</option>
            <option value="Eléctrica">Eléctrica</option>
          </select>
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
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Fecha de compra:</label>
          <input
            type="date"
            name="purchase_date"
            value={formData.purchase_date}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Vida útil (años):</label>
          <input
            type="number"
            name="useful_life"
            value={formData.useful_life}
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
        <button type="submit">Actualizar</button>
      </form>
    </div>
  );
};

export default EditProduct;
