import { useEffect, useState } from "react";
import { format } from "date-fns";
import ReactPaginate from "react-paginate";
import { FaTrashAlt } from "react-icons/fa";
import "./ListarFacturas.css";

const ListarFormularioCompras = () => {
  const [formularios, setFormularios] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10;

    const apiBaseUrl = import.meta.env.VITE_BACKEND_URL;
  const fetchFormularios = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/preinscripciones`);
      const data = await res.json();
      setFormularios(data);
    } catch (error) {
      console.error("Error al obtener formularios:", error);
    }
  };

  const eliminarFormulario = async (id) => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/preinscripciones/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchFormularios(); // Recarga después de eliminar
      } else {
        console.error("Error al eliminar formulario");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  useEffect(() => {
    fetchFormularios();
  }, []);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(formularios.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(formularios.length / itemsPerPage));
  }, [itemOffset, formularios]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % formularios.length;
    setItemOffset(newOffset);
  };

  return (
    <div className="facturas-container">
      <h2>Listado de Formularios Comprados</h2>
      <table className="facturas-table">
        <thead>
          <tr>
            <th>N°</th>
            <th>Nombre Estudiante</th>
            <th>Grado Postula</th>
           
            <th>Año</th>
            <th>Tipo de Pago</th>
            <th>Fecha Compra</th>
            <th>Costo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((formulario, index) => (
              <tr key={formulario._id}>
                <td>{itemOffset + index + 1}</td>
                <td>{formulario.nombreEstudiante}</td>
                <td>{formulario.gradoPostula}</td>
                
                <td>{formulario.tipoFormulario}</td>
                <td>{formulario.tipoPago}</td>
                <td>
                  {formulario.fechaCompraFormulario
                    ? format(new Date(formulario.fechaCompraFormulario), "dd/MM/yyyy")
                    : "Fecha no disponible"}
                </td>
                <td>
                  {formulario.costo
                    ? new Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                      }).format(formulario.costo)
                    : "$0"}
                </td>
                <td>
                  <button
                    className="delete-btn"
                    title="Eliminar formulario"
                    onClick={async () => {
                      if (window.confirm("¿Estás seguro de eliminar este formulario?")) {
                        await eliminarFormulario(formulario._id);
                      }
                    }}
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No hay formularios disponibles</td>
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

export default ListarFormularioCompras;
