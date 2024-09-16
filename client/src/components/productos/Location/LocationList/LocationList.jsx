import React, { useEffect, useState } from 'react';
import { useProducts } from '../../../../contexts/ProductContext';
import './LocationList.css'; // Asegúrate de crear este archivo para el estilo si es necesario
import Search from '../../Search/Search';
import ReactPaginate from 'react-paginate'; // Importa ReactPaginate

const LocationList = () => {
  const { locations, loadingLocations, errorLocations, fetchLocations } = useProducts();
  const [formattedLocations, setFormattedLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    if (!locations.length) {
      fetchLocations(); // Obtiene locaciones si aún no están cargadas
    }
  }, [locations, fetchLocations]);

  useEffect(() => {
    if (locations) {
      const formatted = locations.map((location) => ({
        ...location,
        // Puedes formatear más campos aquí si es necesario
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

      return name.includes(searchTermLower) || address.includes(searchTermLower);
    });

    setCurrentItems(filteredLocations.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredLocations.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, formattedLocations, searchTerm]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % formattedLocations.length;
    setItemOffset(newOffset);
  };

  if (loadingLocations) return <div>Cargando...</div>;
  if (errorLocations) return <div>Error al cargar locaciones.</div>;

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
              {currentItems.length} de {formattedLocations.length} ubicaciones
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
            <th>Entregado Por</th>
            <th>Recibido Por</th>
            <th>Aprobado Por</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((location) => (
            <tr key={location._id}>
              <td>{location.nombre}</td>
              <td>{location.direccion}</td>
              <td>{location.otros_detalles}</td>
              <td>{location.entregado_por}</td>
              <td>{location.recibido_por}</td>
              <td>{location.aprobado_por}</td>
              <td>{location.estado}</td>
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
