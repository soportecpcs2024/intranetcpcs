import React, { useEffect, useState } from "react";
import { useRecaudo } from "../../../../../contexts/RecaudoContext";
import { FaTrashAlt } from "react-icons/fa";
import { format } from "date-fns";

import "./ListarFacturas.css";

const ListarFacturas = () => {
  const { facturas, eliminarFactura, fetchEstudianteById, fetchFacturas, estudiantes, fetchEstudiantes } = useRecaudo();
  const [facturasConEstudiante, setFacturasConEstudiante] = useState([]);
  const [reload, setReload] = useState(false); // Estado para forzar recarga
  
  console.log(facturas);
  
  // Cargar facturas cuando se monta el componente o cuando `reload` cambia
  useEffect(() => {
    fetchFacturas();
    fetchEstudiantes();
  }, [reload]); // Se ejecuta cuando cambia `reload`
  
 

  console.log("Estudiantes :", estudiantes);

  // Cargar nombres de estudiantes cuando `facturas` cambia
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
  }, [facturas]); // Se ejecuta cuando `facturas` cambia
 
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
                    title="Eliminar factura"
                    onClick={async () => {
                      await eliminarFactura(factura._id);
                      setReload((prev) => !prev); // Forzar recarga cambiando `reload`
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
