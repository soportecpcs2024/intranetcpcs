import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../../contexts/ProductContext";
import "./AddProduct.css";

const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: "",
    brand: "",
    sku: "",
    category: "",
    subcategory: "",
    model: "",
    dimensions: "",
    price: "",
    color: "",
    description: "",
    supplier:"",
    useful_life: "", // Vida útil en años
    purchase_date: "", // Fecha de compra
    image: null,
  });

  const [errors, setErrors] = useState({});
  const { createProduct } = useProducts();
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
      image: file,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(productData).forEach((key) => {
      if (key !== "image" && !productData[key].trim()) {
        newErrors[key] = `Please add a ${key}`;
        isValid = false;
      }
    });

    if (!productData.image) {
      newErrors.image = "Please upload an image";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
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
        <div className="add-product-form-b1">
          <label>
            Nombre:
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </label>

          <label>
            Marca:
            <input
              type="text"
              name="brand"
              value={productData.brand}
              onChange={handleChange}
            />
            {errors.brand && <p className="error-message">{errors.brand}</p>}
          </label>
        </div>

        <div className="add-product-form-b1">
          <label>
            Referencia:
            <input
              type="text"
              name="sku"
              value={productData.sku}
              onChange={handleChange}
            />
            {errors.sku && <p className="error-message">{errors.sku}</p>}
          </label>

          <label>
            Precio:
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
            />
            {errors.price && <p className="error-message">{errors.price}</p>}
          </label>

        
        </div>

        <div className="add-product-form-b1">
        <label>
            Categoria:
            <select
              name="category"
              value={productData.category}
              onChange={handleChange}
            >
              <option value="">Categoria:</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Electrodoméstico">Electrodoméstico</option>
              <option value="Inmueble">Inmueble</option>
            </select>
            {errors.area && <p className="error-message">{errors.category}</p>}
          </label>
          <label>
            Sub Cat:
            <select
              name="subcategory"
              value={productData.subcategory}
              onChange={handleChange}
            >
              <option value="">Sub categoria:</option>
              <option value="Cp mesa windows">Cp mesa windows</option>
              <option value="Cp mesa Apple Mac mini">Cp mesa Apple Mac mini</option>
              <option value="Cp mesa Apple Imac">Cp mesa Apple Imac</option>
              <option value="Cp portátil windows">Cp portátil windows</option>
              <option value="Teclado">Teclado</option>           
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
              <option value="Control">Control</option>
              <option value="Gabinete multitoma">Gabinete multitoma</option>
               
               
            </select>
            {errors.subcategory && <p className="error-message">{errors.subcategory}</p>}
          </label>

         
        </div>

        <div className="add-product-form-b1">
          <label>
            Modelo:
            <input
              type="text"
              name="model"
              value={productData.model}
              onChange={handleChange}
            />
            {errors.model && <p className="error-message">{errors.model}</p>}
          </label>

          <label>
            Dimensiones:
            <input
              type="text"
              name="dimensions"
              value={productData.dimensions}
              onChange={handleChange}
            />
            {errors.dimensions && (
              <p className="error-message">{errors.dimensions}</p>
            )}
          </label>

          <label>
            Color:
            <input
              type="text"
              name="color"
              value={productData.color}
              onChange={handleChange}
            />
            {errors.color && <p className="error-message">{errors.color}</p>}
          </label>
        </div>

        <label>
          Descripción:
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
          />
          {errors.description && (
            <p className="error-message">{errors.description}</p>
          )}
        </label>

        <div className="add-product-form-b1">
          <label>
            Vida útil (años):
            <input
              type="number"
              name="useful_life"
              value={productData.useful_life}
              onChange={handleChange}
            />
            {errors.useful_life && (
              <p className="error-message">{errors.useful_life}</p>
            )}
          </label>

          <label>
            Fecha de compra:
            <input
              type="date"
              name="purchase_date"
              value={productData.purchase_date}
              onChange={handleChange}
            />
            {errors.purchase_date && (
              <p className="error-message">{errors.purchase_date}</p>
            )}
          </label>
        </div>
        <label>
          Imagen:
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {errors.image && <p className="error-message">{errors.image}</p>}
        </label>
        <label>
            Proveedor:
            <input
              type="text"
              name="supplier"
              value={productData.supplier}
              onChange={handleChange}
            />
            {errors.supplier && <p className="error-message">{errors.supplier}</p>}
          </label>

        <button type="submit">Crear Producto</button>
      </form>
    </div>
  );
};

export default AddProduct;
