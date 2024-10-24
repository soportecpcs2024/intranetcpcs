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
    subcategory: "", // corregido a subcategory
    model: "",
    dimensions: "",
    price: "",
    color: "",
    description: "",
    supplier: "", // agregado
    quantity: "", // Cantidad agregada
    purchase_date: "",
    useful_life: "", // Vida útil en años
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
          subcategory: foundProduct.subcategory, // Corregido a subcategory
          model: foundProduct.model,
          dimensions: foundProduct.dimensions,
          price: foundProduct.price,
          color: foundProduct.color,
          description: foundProduct.description,
          supplier: foundProduct.supplier, // agregado
          quantity: foundProduct.quantity || "",
          purchase_date: new Date(foundProduct.purchase_date)
            .toISOString()
            .split("T")[0], // Formatear la fecha
          useful_life: foundProduct.useful_life || "",
        });
      }
    } else {
      fetchProducts(); // Cargar productos si no están ya cargados
    }
  }, [id, products, loading, fetchProducts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Error al cargar producto: {error.message}</p>;
  }

  if (!product) {
    return <p>Producto no encontrado.</p>;
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
        <label>
            Categoria:
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Categoria:</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Electrodoméstico">Electrodoméstico</option>
              <option value="Inmueble">Inmueble</option>
            </select>
             </label>
        </div>
        <div className="form-group">
          <label>Subcategoría:</label>
          <select
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
          >
            <option value="">Selecciona una subcategoría</option>
            <option value="Cp mesa windows">Cp mesa windows</option>
            <option value="Cp mesa Apple Mac mini">Cp mesa Apple Mac mini</option>
            <option value="Cp mesa Apple Imac">Cp mesa Apple Imac</option>
            <option value="Cp portátil windows">Cp portátil windows</option>
            <option value="Cargador TC">Cargador TC</option>
            <option value="Tablet">Tablet</option>
            <option value="Tv Smart 50">Tv Smart 50</option>
            <option value="Tv Smart 55">Tv Smart 55</option>
            <option value="Tv Smart 60">Tv Smart 60</option>
            <option value="Monitor 24">Monitor 24</option>
            <option value="Monitor 32">Monitor 32</option>
            <option value="Mixer">Mixer</option>
            <option value="Parlante">Parlante</option>
            <option value="Silla">Silla</option>
            <option value="Cocina">Cocina</option>
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
          <label>Color:</label>
          <input
            type="text"
            name="color"
            value={formData.color}
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

        <div className="form-group">
          <label>Proveedor:</label>
          <input
            type="text"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Cantidad:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
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

        <button type="submit">Actualizar Producto</button>
      </form>
    </div>
  );
};

export default EditProduct;
