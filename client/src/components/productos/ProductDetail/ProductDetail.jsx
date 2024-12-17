import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../../../contexts/ProductContext";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const { products, loading, error } = useProducts();
  
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && products.length > 0) {
      const foundProduct = products.find((p) => p._id === id);
      setProduct(foundProduct);
    }
  }, [id, products, loading]);

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>Error loading product: {error.message}</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  const handleBackClick = () => {
    navigate("/admin/administracion/productList");
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(value);
  };

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    

    // Ajustar la fecha según el desfase horaria si es necesario
    // Considerando que la fecha se muestra en la zona horaria local
    // Puedes ajustar el desfase si observas un desfase consistente
    const offset = date.getTimezoneOffset() / 60; // Offset en horas
    date.setHours(date.getHours() - offset);

    return date.toLocaleDateString("es-CO", {
      timeZone: "America/Bogota",
    });
  };

  return (
    <div className="product-detail-container">
      <div className="product-detail-header">
        <h3>Detalles de producto:</h3>
        <div className="product-detail-img-content">
          <img
            className="product-detail-img"
            src={product.image.filePath}
            alt={product.name}
          />
        </div>
        <h3 className="product-detail-img-content-title">
         {product.name}
        </h3>
      </div>
      <div className="product-detail-info">
        <p>
          <span className="product-detail-info-span">Marca</span>:{" "}
          {product.brand}
        </p>
        <p>
          <span className="product-detail-info-span">Referencia</span>:{" "}
          {product.sku}
        </p>
        <p>
          <span className="product-detail-info-span">Categoría</span>:{" "}
          {product.category}
        </p>
        <p>
          <span className="product-detail-info-span">Área</span>:{" "}
          {product.subcategory}
        </p>
        <p>
          <span className="product-detail-info-span">Modelo</span>:{" "}
          {product.model}
        </p>
        <p>
          <span className="product-detail-info-span">Precio/und:</span>{" "}
          {formatCurrency(product.price)}
        </p>
        <p>
          <span className="product-detail-info-span">Dimensiones:</span>{" "}
          {product.dimensions}
        </p>
        <p>
          <span className="product-detail-info-span">Color:</span>{" "}
          {product.color}
        </p>
        <p>
          <span className="product-detail-info-span">Descripción:</span>{" "}
          {product.description}
        </p>
        <p>
          <span className="product-detail-info-span">Depreciación por año:</span>{" "}
          {formatCurrency(product.depreciation)}
        </p>
        <p>
          <span className="product-detail-info-span">Fecha de compra:</span>{" "}
          {formatDate(product.purchase_date)}
        </p>
        <p>
          <span className="product-detail-info-span">Vida útil:</span>{" "}
          {product.useful_life} años
        </p>
      </div>

      <button className="back-button" onClick={handleBackClick}>
        Volver a la lista
      </button>
    </div>
  );
};

export default ProductDetail;
