// components/CardProducto.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './producto.css';

const CardProducto = ({ name, sku, category, quantity, price, description, image }) => {
  // Reemplaza las barras invertidas por barras normales
  const imageUrl = image ? `http://localhost:3000/${image.replace(/\\/g, '/')}` : '';

  return (
    <div className="card-producto">
      {imageUrl && <img src={imageUrl} alt={name} className="product-image" />}
      <h3>{name}</h3>
      <p><strong>SKU:</strong> {sku}</p>
      <p><strong>Category:</strong> {category}</p>
      <p><strong>Quantity:</strong> {quantity}</p>
      <p><strong>Price:</strong> {price}</p>
      <p><strong>Description:</strong> {description}</p>
    </div>
  );
};

CardProducto.propTypes = {
  name: PropTypes.string.isRequired,
  sku: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  quantity: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string
};

export default CardProducto;
