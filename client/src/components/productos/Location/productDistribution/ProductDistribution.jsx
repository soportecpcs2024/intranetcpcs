import React, { useState, useEffect } from "react";
import { useProducts } from "../../../../contexts/ProductContext";
import "./ProductDistribution.css";

const ProductDistribution = () => {
  const { units, loadingUnits, errorUnits, fetchUnits } = useProducts();
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

  return (
    <div className="product-distribution-container">
      <h2>Distribución de Productos</h2>

      <div className="layout-container">
        {/* Lista de ubicaciones a la izquierda */}
        <div className="location-list">
          {groupedByLocation && Object.keys(groupedByLocation).length > 0 ? (
            Object.keys(groupedByLocation).map((locationId) => (
              <h2
                key={locationId}
                className={`location-item ${
                  selectedLocation === locationId ? "selected" : ""
                }`}
                onClick={() => setSelectedLocation(locationId)} // Cambiar la ubicación seleccionada al hacer clic
              >
                {groupedByLocation[locationId].locationDetails.nombre}
              </h2>
            ))
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
                  <span className="product-details-encargado">Encargado :</span>{" "} <span className="product-details-encargado-span">{
                    groupedByLocation[selectedLocation].locationDetails
                      .recibido_por
                  }</span>
                  
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
                        {/* Otros campos que quieras mostrar */}
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
