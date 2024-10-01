import React, { useEffect, useState } from "react";
import { useProducts } from "../../../../contexts/ProductContext";
import ReactPaginate from "react-paginate"; // Importa ReactPaginate
import './LocationDetails.css'; // Asegúrate de importar tu archivo CSS

const LocationDetails = () => {
  const { units, loadingUnits, errorUnits } = useProducts();
  const [groupedUnits, setGroupedUnits] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [currentItems, setCurrentItems] = useState([]); // Estado para ítems actuales
  const [pageCount, setPageCount] = useState(0); // Estado para el número total de páginas
  const [itemOffset, setItemOffset] = useState(0); // Estado para el offset
  const itemsPerPage = 10; // Número de ítems por página

  // Agrupar las unidades por nombre de la locación y contar productos por nombre
  useEffect(() => {
    if (units) {
      const grouped = units.reduce((acc, unit) => {
        const locationName = unit.location.nombre; // Nombre de la ubicación
        const productName = unit.id_producto.name;

        if (!acc[locationName]) {
          acc[locationName] = {};
        }

        if (!acc[locationName][productName]) {
          acc[locationName][productName] = {
            product: unit.id_producto,
            count: 0,
          };
        }

        acc[locationName][productName].count += 1;

        return acc;
      }, {});
      setGroupedUnits(grouped);
    }
  }, [units]);

  // Filtrar las unidades por el término de búsqueda y paginación
  useEffect(() => {
    const filteredUnits = Object.keys(groupedUnits).reduce((acc, locationName) => {
      // Filtrar por nombre de ubicación
      if (locationName.toLowerCase().includes(searchTerm.toLowerCase())) {
        acc[locationName] = groupedUnits[locationName]; // Agregar la ubicación si coincide
      }
      return acc;
    }, {});

    const paginatedUnits = Object.keys(filteredUnits).slice(itemOffset, itemOffset + itemsPerPage);
    setCurrentItems(paginatedUnits);
    setPageCount(Math.ceil(Object.keys(filteredUnits).length / itemsPerPage));
  }, [searchTerm, groupedUnits, itemOffset]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % Object.keys(groupedUnits).length;
    setItemOffset(newOffset);
  };

  return (
    <>
      <h2>Asignaciones por ubicación</h2>

      {loadingUnits && <p>Cargando unidades...</p>}
      {errorUnits && <p>Error al cargar las unidades</p>}

      <div className="location-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar ubicación"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setItemOffset(0); // Resetear el offset al buscar
            }}
          />
        </div>

        {currentItems.length > 0 ? (
          currentItems.map(locationName => (
            <div key={locationName} className="location-card">
              <h3 className="location-title">Ubicación: {locationName}</h3>

              {Object.keys(groupedUnits[locationName]).map(productName => {
                const { product, count } = groupedUnits[locationName][productName];
                return (
                  <div key={product._id} className="product-card">
                    <h4 className="product-name">{product.name}</h4>
                    <p className="product-quantity">{count} disponibles</p>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <p>No se encontraron unidades</p>
        )}
      </div>

      <ReactPaginate
        breakLabel="..."
        nextLabel="Siguiente"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="Anterior"
        containerClassName="pagination"
        pageLinkClassName="page-num"
        previousLinkClassName="page-num"
        nextLinkClassName="page-num"
        activeLinkClassName="activePage"
      />
    </>
  );
};

export default LocationDetails;
