import React from "react";

const GenerarFacturadocumento = ({ factura }) => {
  if (!factura) return null;

  return (
    <div className="factura-container">
      <h2>Factura</h2>
      <p><strong>ID Factura:</strong> {factura._id}</p>
      <p><strong>Registrador:</strong> {factura.nombreRegistrador}</p>
      <p><strong>Fecha:</strong> {new Date(factura.fechaCompra).toLocaleString()}</p>
      <p><strong>Tipo de Pago:</strong> {factura.tipoPago}</p>
      <p><strong>Total:</strong> ${factura.total.toLocaleString()}</p>

      <h3>Clases</h3>
      <ul>
        {factura.clases.map((clase) => (
          <li key={clase.claseId}>
            <strong>{clase.nombreClase}</strong> - {clase.dia} {clase.hora} - ${clase.costo.toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GenerarFacturadocumento;
