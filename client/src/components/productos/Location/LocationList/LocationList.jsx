import React, { useEffect, useState } from "react";
import { useProducts } from "../../../../contexts/ProductContext";
import "./LocationList.css";
import Search from "../../Search/Search";
import ReactPaginate from "react-paginate"; // Importa ReactPaginate
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa"; // Íconos
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";

const LocationList = () => {
  const { locations, loadingLocations, errorLocations, fetchLocations, removeLocation } = useProducts(); // Asegúrate de incluir `removeLocation` del contexto
  const [formattedLocations, setFormattedLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 15;

  useEffect(() => {
    if (!locations.length) {
      fetchLocations(); // Obtiene locaciones si aún no están cargadas
    }
  }, [locations, fetchLocations]);

  useEffect(() => {
    if (locations) {
      const formatted = locations.map((location) => ({
        ...location,
      }));
      setFormattedLocations(formatted);
    }
  }, [locations]);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;

    // Filtrar locaciones basadas en el término de búsqueda
    const filteredLocations = formattedLocations.filter((location) => {
      const name = location.nombre?.toLowerCase() || "";
      const address = location.direccion?.toLowerCase() || "";
      const searchTermLower = searchTerm.toLowerCase();

      return (
        name.includes(searchTermLower) || address.includes(searchTermLower)
      );
    });

    setCurrentItems(filteredLocations.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredLocations.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, formattedLocations, searchTerm]);

  const handlePageClick = (event) => {
    const newOffset =
      (event.selected * itemsPerPage) % formattedLocations.length;
    setItemOffset(newOffset);
  };

  if (loadingLocations) return <div>Cargando...</div>;
  if (errorLocations) return <div>Error al cargar locaciones.</div>;

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Eliminar ubicación",
      message: "¿Estás seguro de que deseas eliminar esta ubicación?",
      buttons: [
        {
          label: "Eliminar",
          onClick: () => {
            removeLocation(id); // Usa `removeLocation` para eliminar la locación
          },
        },
        {
          label: "Cancelar",
        },
      ],
    });
  };

  return (
    <div className="location-container">
      <h3>Lista de Ubicaciones</h3>

      <div className="container-listUnits-Search">
        <div>
          <Search
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="container-listUnits-Search-ps">
          {/* Mostrar número de ítems listados */}
          <div>
            <p>Ubicaciones:</p>
          </div>
          <div>
            <p className="item-count">
              {currentItems.length} de {formattedLocations.length}
            </p>
          </div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Detalles</th>
            <th>Recibido Por</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((location) => (
            <tr key={location._id}>
              <td>{location.nombre}</td>
              <td>{location.direccion}</td>
              <td>{location.otros_detalles}</td>
              <td>{location.recibido_por}</td>
              <td>{location.estado}</td>
              <td>
                <div className="icon-container">
                  <Link
                    to={`/admin/administracion/editlocation/${location._id}`}
                    className="view-icon"
                  >
                    <FaEdit size={20} color={"green"} />
                  </Link>
                  <Link
                    onClick={() => confirmDelete(location._id)}
                    className="view-icon"
                  >
                    <FaTrashAlt size={20} color={"red"} />
                  </Link>
                </div>
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

export default LocationList;
