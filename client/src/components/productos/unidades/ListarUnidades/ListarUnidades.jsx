import React, { useEffect, useState } from "react";
import { useProducts } from "../../../../contexts/ProductContext";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import "./ListarUnidades.css";
import Search from "../../Search/Search";
import ReactPaginate from "react-paginate"; // Importar ReactPaginate

const ListarUnidades = () => {
  const { units, loadingUnits, errorUnits } = useProducts();
  const [formattedUnits, setFormattedUnits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    if (units) {
      const formatted = units.map((unit) => ({
        ...unit,
        fecha_entrega: unit.fecha_entrega
          ? new Date(unit.fecha_entrega).toLocaleDateString()
          : "N/A",
        fecha_devolucion: unit.fecha_devolucion
          ? new Date(unit.fecha_devolucion).toLocaleDateString()
          : "N/A",
      }));
      setFormattedUnits(formatted);
    }
  }, [units]);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;

    // Filtrar unidades basadas en el término de búsqueda
    const filteredUnits = formattedUnits.filter((unit) => {
      const name = unit.id_producto?.name?.toLowerCase() || "";
      const locationName = unit.location?.nombre?.toLowerCase() || "";
      const locationAddress = unit.location?.direccion?.toLowerCase() || "";
      const searchTermLower = searchTerm.toLowerCase();

      return (
        name.includes(searchTermLower) ||
        locationName.includes(searchTermLower) ||
        locationAddress.includes(searchTermLower)
      );
    });

    setCurrentItems(filteredUnits.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredUnits.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, formattedUnits, searchTerm]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % formattedUnits.length;
    setItemOffset(newOffset);
  };

  if (loadingUnits) return <div>Cargando...</div>;
  if (errorUnits) return <div>Error al cargar unidades.</div>;

  return (
    <div className="container">
      <h3>Listar Unidades</h3>
      <div className="container-listUnits-Search">
        <div>
          <Search
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="container-listUnits-Search-ps">
          {/* Mostrar número de items listados */}
          <div>
            <p>Unidades : </p>
          </div>
          <div>
            <p className="item-count">
              {currentItems.length} de {formattedUnits.length}
              {/* Cantidad unidades {currentItems.length} de {formattedUnits.length} unidades */}
            </p>
          </div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Marca</th>
             
            <th>Lugar</th>
            <th>Ubicación</th>
            <th>Estado</th>
           
            <th>Ver</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((unit) => (
            <tr key={unit._id}>
              <td>{unit.id_producto?.name || "N/A"}</td>
              <td>{unit.id_producto?.brand || "N/A"}</td>
              
              <td>{unit.location?.nombre || "N/A"}</td>
              <td>{unit.location?.direccion || "N/A"}</td>
              <td>{unit.estado || "N/A"}</td>
               
              <td>
                <Link
                  to={`/admin/administracion/units/${unit._id}`}
                  className="view-icon"
                >
                  <FaEye />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Componente de paginación */}
      <ReactPaginate
        breakLabel="..."
        nextLabel="Siguiente"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="Anterior"
        renderOnZeroPageCount={null}
        containerClassName="pagination"
        pageLinkClassName="page-num"
        previousLinkClassName="page-num"
        nextLinkClassName="page-num"
        activeLinkClassName="activePage"
      />
    </div>
  );
};

export default ListarUnidades;
