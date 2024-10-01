import React, { useEffect, useState } from "react";
import { useProducts } from "../../../../contexts/ProductContext";
import "./EstadisUnidades.css"; // Asegúrate de tener el archivo CSS para los estilos

const EstadisUnidades = () => {
  const { units } = useProducts();
  const [unitCounts, setUnitCounts] = useState([]);

  useEffect(() => {
    if (units && units.length > 0) {
      // Agrupar las unidades por la categoría del producto y contar la cantidad de cada una
      const groupedUnits = units.reduce((acc, unit) => {
        const product = unit.id_producto; // Asegúrate de que 'id_producto' existe
        const productCategory = product?.category; // Verifica si la categoría está definida

        if (productCategory && product) {
          if (!acc[productCategory]) {
            acc[productCategory] = {
              count: 0,
              product: product, // Guardamos el producto
            };
          }
          acc[productCategory].count += 1;
        }
        return acc;
      }, {});

      // Convertir el objeto agrupado en un array para poder mapearlo
      setUnitCounts(Object.values(groupedUnits));
    }
  }, [units]);

  return (
    <div className="card-container-units">
      {unitCounts.length === 0 ? (
        <p>No hay unidades disponibles.</p>
      ) : (
        unitCounts.map((unitGroup, index) => (
          <div key={index} className="unit-card">
            {unitGroup.product && unitGroup.product.image ? (
              <img
                src={unitGroup.product.image.filePath}
                alt={unitGroup.product.name}
                className="unit-image"
              />
            ) : (
              <img
                src="/path/to/default-image.jpg" // Reemplaza con la ruta de una imagen por defecto
                alt="Imagen no disponible"
                className="unit-image"
              />
            )}
            <div className="unit-info">
              <h4>{unitGroup.product.category}</h4>
              <p>Cantidad: {unitGroup.count}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default EstadisUnidades;
