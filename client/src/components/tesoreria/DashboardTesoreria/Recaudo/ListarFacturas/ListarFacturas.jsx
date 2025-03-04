import React, { useEffect, useState } from "react";
import { useRecaudo } from "../../../../../contexts/RecaudoContext";
import { FaTrashAlt } from "react-icons/fa";
import { format } from "date-fns";

import "./ListarFacturas.css";

const ListarFacturas = () => {
  const { facturas, eliminarFactura, fetchEstudianteById, fetchFacturas } =
    useRecaudo();
  const [facturasConEstudiante, setFacturasConEstudiante] = useState([]);

  useEffect(() => {
    const cargarFacturas = async () => {
      await fetchFacturas(); // Cargar facturas desde la base de datos
    };

    cargarFacturas();
  }, []); // Se ejecuta solo cuando el componente se monta

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
  }, [facturas]); // Se ejecuta cuando las facturas cambian

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
                <td>{factura.estudianteId.nombre}</td>
                <td>{factura.tipoPago}</td>
                <td>
                  {factura.fechaCompra
                    ? format(new Date(factura.fechaCompra), "dd/MM/yyyy")
                    : "Fecha no disponible"}
                </td>
                <td>
                  {factura.total
                    ? new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                      }).format(factura.total)
                    : "$0"}
                </td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() => {
                      eliminarFactura(factura._id);
                      fetchFacturas(); // Recargar después de eliminar
                    }}
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
