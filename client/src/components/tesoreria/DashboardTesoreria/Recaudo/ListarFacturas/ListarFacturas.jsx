import React from "react";
import { useRecaudo } from "../../../../../contexts/RecaudoContext";
import "./ListarFacturas.css";

const ListarFacturas = () => {
  const { facturas, eliminarFactura } = useRecaudo();

  return (
    <div className="facturas-container">
      <h2>Listado de Facturas</h2>
      <table className="facturas-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Estudiante</th>
            <th>Clases</th>
            <th>Tipo de Pago</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facturas.length > 0 ? (
            facturas.map((factura) => (
              <tr key={factura._id}>
                <td>{factura._id}</td>
                <td>{factura.estudiante?.nombre || "N/A"}</td>
                <td>
                  {factura.clases
                    .map((clase) => clase.nombre || "N/A")
                    .join(", ")}
                </td>
                <td>{factura.tipoPago}</td>
                <td>${factura.total}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => eliminarFactura(factura._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No hay facturas disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListarFacturas;
