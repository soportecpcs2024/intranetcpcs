import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Importa useNavigate
import { useProducts } from "../../../contexts/ProductContext";
import "./ProductDetail.css"; // Asegúrate de tener este archivo CSS vinculado

const ProductDetail = () => {
  const { id } = useParams(); // Obtiene el id del producto de los parámetros de la URL
  const { products, loading, error } = useProducts(); // Obtiene los productos, el estado de carga y cualquier error del contexto
  const [product, setProduct] = useState(null);
  const navigate = useNavigate(); // Instancia useNavigate para la navegación

  useEffect(() => {
    if (!loading && products.length > 0) {
      // Busca el producto si los productos ya se han cargado
      const foundProduct = products.find((p) => p._id === id);
      setProduct(foundProduct);
    }
  }, [id, products, loading]);

  if (loading) {
    return <p>Loading products...</p>; // Muestra un mensaje de carga si los productos están cargando
  }

  if (error) {
    return <p>Error loading product: {error.message}</p>; // Muestra un mensaje de error si hay un problema al cargar los productos
  }

  if (!product) {
    return <p>Product not found.</p>; // Muestra un mensaje si no se encuentra el producto
  }

  // Función para manejar el clic en el botón de volver
  const handleBackClick = () => {
    navigate("/admin/administracion/productList"); // Navega de vuelta a la lista de productos
  };



  // Función para formatear valores en pesos colombianos
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(value);
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
          Nombre : {product.name}
        </h3>
      </div>
      <div className="product-detail-info">
        <p><span className="product-detail-info-span">Marca</span> : {product.brand}</p>
        <p><span className="product-detail-info-span">Referencia</span> : {product.sku}</p>
        <p><span className="product-detail-info-span">Categoria</span> : {product.category}</p>
        <p><span className="product-detail-info-span">Modelo</span> : {product.model}</p>
        <p> <span className="product-detail-info-span">Precio/und:</span> {formatCurrency(product.price)}</p>
        <p> <span className="product-detail-info-span">Dimensiones:</span> {product.dimensions}</p>
        <p><span className="product-detail-info-span">Cantidad Stock:</span> {product.quantity}</p>
        <p><span className="product-detail-info-span">Color:</span> {product.color}</p>
        <p><span className="product-detail-info-span">Descripción :</span>  {product.description}</p>
      </div>
      
      <button className="back-button" onClick={handleBackClick}>
        Volver a la lista
      </button>
    </div>
  );
};

export default ProductDetail;
