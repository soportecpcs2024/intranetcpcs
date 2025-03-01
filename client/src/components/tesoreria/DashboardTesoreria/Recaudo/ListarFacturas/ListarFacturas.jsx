import React, { useEffect, useState } from "react";
import { useRecaudo } from "../../../../../contexts/RecaudoContext";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
 
import "./ListarFacturas.css";

const ListarFacturas = () => {
  const { facturas, eliminarFactura, fetchEstudianteById } = useRecaudo();
  const [facturasConEstudiante, setFacturasConEstudiante] = useState([]);

  useEffect(() => {
    const cargarNombresEstudiantes = async () => {
      const nuevasFacturas = await Promise.all(
        facturas.map(async (factura) => {
          if (factura.estudianteId) {
            const estudiante = await fetchEstudianteById(factura.estudianteId);
            return {
              ...factura,
              nombreEstudiante: estudiante ? estudiante.nombre : "Desconocido",
            };
          }
          return { ...factura, nombreEstudiante: "N/A" };
        })
      );
      setFacturasConEstudiante(nuevasFacturas);
    };

    if (facturas.length > 0) {
      cargarNombresEstudiantes();
    }
  }, [facturas]);

  return (
    <div className="facturas-container">
      <h2>Listado de Facturas</h2>
      <table className="facturas-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Estudiante</th>
            <th>Método de Pago</th>
            <th>Fecha de compra</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facturasConEstudiante.length > 0 ? (
            facturasConEstudiante.map((factura) => (
              <tr key={factura._id}>
                <td>{factura.numero_factura}</td>
                <td>{factura.nombreEstudiante}</td>
                <td>{factura.tipoPago}</td>
                <td>{factura.fechaCompra}</td>
                <td>${factura.total}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => eliminarFactura(factura._id)}
                  >
                    <FaTrashAlt />
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
