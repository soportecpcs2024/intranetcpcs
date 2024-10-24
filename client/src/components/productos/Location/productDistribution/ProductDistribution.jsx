import React, { useState, useEffect } from "react";
import { useProducts } from "../../../../contexts/ProductContext";
import "./ProductDistribution.css";

const ProductDistribution = () => {
  const { units, loadingUnits, errorUnits, fetchUnits, locations } =
    useProducts();
  const [selectedLocation, setSelectedLocation] = useState(null); // Estado para la ubicación seleccionada

  // Agrupar productos por location_id y contar por producto
  const groupedByLocation = units?.reduce((acc, unit) => {
    const locationId = unit.location?._id || "Unknown"; // Asignar 'Unknown' si no tiene location
    const productName = unit.id_producto.name; // Obtener el nombre del producto

    if (!acc[locationId]) {
      acc[locationId] = {
        locationDetails: unit.location, // Guardar los detalles de la ubicación
        products: {}, // Inicializar lista de productos como un objeto para contar
      };
    }

    // Si el producto ya existe en la ubicación, incrementar el contador
    if (acc[locationId].products[productName]) {
      acc[locationId].products[productName].count += 1;
    } else {
      // Si no existe, inicializar el producto con count = 1
      acc[locationId].products[productName] = {
        details: unit.id_producto, // Guardar los detalles del producto
        count: 1, // Inicializar el contador
      };
    }

    return acc;
  }, {});

  useEffect(() => {
    fetchUnits(); // Para asegurarte de que los productos se obtengan al cargar el componente
  }, [fetchUnits]);

  if (loadingUnits) return <p>Loading...</p>;
  if (errorUnits) return <p>Error loading units: {errorUnits.message}</p>;

  // Filtrar las ubicaciones que comienzan con "A" en la dirección
  const locationsBloqueA = Object.keys(groupedByLocation).filter(
    (locationId) => {
      const locationDetails = groupedByLocation[locationId].locationDetails;
      return (
        locationDetails?.direccion && locationDetails.direccion.startsWith("A")
      );
    }
  );
  // Filtrar las ubicaciones que comienzan con "A" en la dirección
  const locationsBloqueB = Object.keys(groupedByLocation).filter(
    (locationId) => {
      const locationDetails = groupedByLocation[locationId].locationDetails;
      return (
        locationDetails?.direccion && locationDetails.direccion.startsWith("B")
      );
    }
  );
  // Filtrar las ubicaciones que comienzan con "A" en la dirección
  const locationsBloqueC = Object.keys(groupedByLocation).filter(
    (locationId) => {
      const locationDetails = groupedByLocation[locationId].locationDetails;
      return (
        locationDetails?.direccion && locationDetails.direccion.startsWith("C")
      );
    }
  );
  // Filtrar las ubicaciones que comienzan con "A" en la dirección
  const locationsBloqueD = Object.keys(groupedByLocation).filter(
    (locationId) => {
      const locationDetails = groupedByLocation[locationId].locationDetails;
      return (
        locationDetails?.direccion && locationDetails.direccion.startsWith("D")
      );
    }
  );
  // Filtrar las ubicaciones que comienzan con "A" en la dirección
  const locationsBloqueE = Object.keys(groupedByLocation).filter(
    (locationId) => {
      const locationDetails = groupedByLocation[locationId].locationDetails;
      return (
        locationDetails?.direccion && locationDetails.direccion.startsWith("E")
      );
    }
  );
  // Filtrar las ubicaciones que comienzan con "A" en la dirección
  const locationsBloqueF = Object.keys(groupedByLocation).filter(
    (locationId) => {
      const locationDetails = groupedByLocation[locationId].locationDetails;
      return (
        locationDetails?.direccion && locationDetails.direccion.startsWith("F")
      );
    }
  );
  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  return (
    <div className="product-distribution-container">
      <h2>Distribución de Productos</h2>
      <div className="product-distribution-container-asignaciones">
        <div className="total-ubicaciones">
          <p className="total-ubicaciones-text">Total de ubicaciones: </p>
          <p className="total-ubicaciones-num">
            {Object.keys(locations).length}
          </p>
        </div>
        <div className="total-ubicaciones">
          <p className="total-ubicaciones-text">Ubicaciones con asignación: </p>
          <p className="total-ubicaciones-num">
            {Object.keys(groupedByLocation).length}
          </p>
        </div>
        <div className="total-ubicaciones-btn">
          <div className="total-ubicaciones-bloque">
            <p className="total-ubicaciones-text">Bloque A: </p>
            <p className="total-ubicaciones-num">{locationsBloqueA.length}</p>
          </div>
          <div className="total-ubicaciones-bloque">
            <p className="total-ubicaciones-text">Bloque B: </p>
            <p className="total-ubicaciones-num">{locationsBloqueB.length}</p>
          </div>
          <div className="total-ubicaciones-bloque">
            <p className="total-ubicaciones-text">Bloque C: </p>
            <p className="total-ubicaciones-num">{locationsBloqueC.length}</p>
          </div>
          <div className="total-ubicaciones-bloque">
            <p className="total-ubicaciones-text">Bloque D: </p>
            <p className="total-ubicaciones-num">{locationsBloqueD.length}</p>
          </div>
          <div className="total-ubicaciones-bloque">
            <p className="total-ubicaciones-text">Bloque E: </p>
            <p className="total-ubicaciones-num">{locationsBloqueE.length}</p>
          </div>
          <div className="total-ubicaciones-bloque">
            <p className="total-ubicaciones-text">Bloque F: </p>
            <p className="total-ubicaciones-num">{locationsBloqueF.length}</p>
          </div>
        </div>
      </div>

      <div className="layout-container">
        {/* Lista de ubicaciones a la izquierda */}
        <div className="location-list">
          {groupedByLocation && Object.keys(groupedByLocation).length > 0 ? (
            <select
              value={selectedLocation || ""}
              onChange={(e) => setSelectedLocation(e.target.value)} // Cambiar la ubicación seleccionada al cambiar el valor
              className="location-dropdown"
            >
              <option value="" disabled>
                Selecciona una ubicación
              </option>
              {Object.keys(groupedByLocation)
                .sort((a, b) => {
                  // Ordenar alfabéticamente por el nombre de la ubicación
                  const nameA =
                    groupedByLocation[a].locationDetails.nombre.toLowerCase();
                  const nameB =
                    groupedByLocation[b].locationDetails.nombre.toLowerCase();
                  return nameA.localeCompare(nameB);
                })
                .map((locationId) => (
                  <option key={locationId} value={locationId}>
                    {groupedByLocation[locationId].locationDetails.direccion}
                  </option>
                ))}
            </select>
          ) : (
            <p>No se encontraron unidades</p>
          )}
        </div>

        {/* Detalles de productos a la derecha */}
        <div className="product-details">
          {selectedLocation && groupedByLocation[selectedLocation] ? (
            <>
              <div>
                <h2>
                  {
                    groupedByLocation[selectedLocation].locationDetails
                      .direccion
                  }
                </h2>

                <p>
                  <span className="product-details-encargado">Encargado :</span>{" "}
                  <span className="product-details-encargado-span">
                    {
                      groupedByLocation[selectedLocation].locationDetails
                        .recibido_por
                    }
                  </span>
                </p>
              </div>

              <ul>
                {Object.keys(groupedByLocation[selectedLocation].products).map(
                  (productName) => {
                    const product =
                      groupedByLocation[selectedLocation].products[productName];
                    return (
                      <li key={product.details._id}>
                        <div className="product-item">
                          <div>
                            <strong>{product.details.name}</strong>
                          </div>
                          <div>
                            <p>Unid: {product.count}</p>
                          </div>
                        </div>
                      </li>
                    );
                  }
                )}
              </ul>
            </>
          ) : (
            <p>Selecciona una ubicación para ver los detalles.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDistribution;
