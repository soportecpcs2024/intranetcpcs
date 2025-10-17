import React, { useState } from "react";
import "./ProductoModal.css";

const ProductoModal = ({ producto, onClose, onAccept }) => {
  const [cantidad, setCantidad] = useState(1);

  if (!producto) return null; // No renderiza si no hay producto seleccionado

  const handleAccept = () => {
    if (cantidad < 1) return;
    onAccept({ ...producto, cantidad });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
        <h3>{producto.nombre}</h3>
        <p><strong>Referencia:</strong> {producto.referencia}</p>
        <p><strong>Categoría:</strong> {producto.categoria}</p>

        <div className="modal-cantidad">
          <label>Cantidad:</label>
          <input
            type="number"
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
          />
        </div>

        <div className="modal-botones">
          <button className="btn-cerrar" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-aceptar" onClick={handleAccept}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductoModal;
