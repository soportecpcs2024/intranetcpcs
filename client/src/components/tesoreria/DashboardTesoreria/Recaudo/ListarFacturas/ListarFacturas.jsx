import React, { useEffect, useState } from "react";
import { useRecaudo } from "../../../../../contexts/RecaudoContext";
import { FaTrashAlt } from "react-icons/fa";
import { format } from "date-fns";
import ReactPaginate from "react-paginate";
import "./ListarFacturas.css";

const ListarFacturas = () => {
  const {
    facturas,
    eliminarFactura,
    fetchFacturas,
    fetchEstudiantes,
    estudiantes,
  } = useRecaudo();
  
  const [estudiantesMap, setEstudiantesMap] = useState({});
  const [facturasConEstudiante, setFacturasConEstudiante] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10;
  
  

  // Recargar datos
  const handleReload = async () => {
    await fetchEstudiantes();
    await fetchFacturas();
  };

  useEffect(() => {
    handleReload();
  }, []);


  // Crear mapa de estudiantes { id: nombre }
  useEffect(() => {
    if (estudiantes.length > 0) {
      const nuevoMapa = {};
      estudiantes.forEach((estudiante) => {
        nuevoMapa[estudiante._id] = estudiante.nombre;
      });

      setEstudiantesMap(nuevoMapa);
    }
  }, [estudiantes]);


  
  // Asignar nombres a facturas
  useEffect(() => {
    if (facturas.length > 0 && Object.keys(estudiantesMap).length > 0) {
      const nuevasFacturas = facturas.map((factura) => ({
        ...factura,
        nombreEstudiante: factura.estudianteId?.nombre.trim() || "Desconocido",
      }));
      
      setFacturasConEstudiante(nuevasFacturas);
    }
  }, [facturas, estudiantesMap]);

 
  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(facturasConEstudiante.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(facturasConEstudiante.length / itemsPerPage));
  }, [itemOffset, facturasConEstudiante]);
  

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % facturas.length;
    setItemOffset(newOffset);
  };
   
 
  
  return (
    <div className="facturas-container">
      <h2>Listado de Facturas</h2>
      <table className="facturas-table">
        <thead>
          <tr>
          <th>N°</th>
            <th>ID</th>
            <th>Estudiante</th>
            <th>Método de Pago</th>
            <th>Fecha de compra</th>
            <th>Mes Aplicado</th>
            <th>Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((factura, index) => (
              
              <tr key={factura._id}>
                <td>{itemOffset + index + 1}</td>
                <td>{factura.numero_factura}</td>
                <td >{factura.nombreEstudiante}</td>
                <td>{factura.tipoPago}</td>
                <td>
                  {factura.fechaCompra
                    ? format(new Date(factura.fechaCompra), "dd/MM/yyyy")
                    : "Fecha no disponible"}
                </td>
                <td>{factura.mes_aplicado}</td>
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
                      handleReload();
                    }}
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No hay facturas disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
      <ReactPaginate
        breakLabel="..."
        nextLabel="Siguiente"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="Anterior"
        containerClassName="pagination"
        activeClassName="active"
      />
    </div>
  );
};

export default ListarFacturas;
