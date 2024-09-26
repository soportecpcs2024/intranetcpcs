import React, { useEffect, useState } from "react";
import { useProducts } from "../../../../contexts/ProductContext";
import "./EstadisUnidades.css"; // Asegúrate de crear este archivo CSS para estilizar

const EstadisUnidades = () => {
  const { units } = useProducts();
  const [unitCounts, setUnitCounts] = useState([]);

  useEffect(() => {
    if (units) {
      // Agrupar las unidades por el nombre del producto y contar la cantidad de cada una
      const groupedUnits = units.reduce((acc, unit) => {
        const productName = unit.id_producto?.name;
        if (!acc[productName]) {
          acc[productName] = {
            count: 0,
            product: unit.id_producto,
          };
        }
        acc[productName].count += 1;
        return acc;
      }, {});

      // Convertir el objeto agrupado en un array para poder mapearlo fácilmente
      setUnitCounts(Object.values(groupedUnits));
    }
  }, [units]);

  return (
    <div className="estadisticas-container">
       
      <div className="card-container">
        {unitCounts.map((unitGroup, index) => (
          <div key={index} className="unit-card">
            <img
              src={unitGroup.product.image?.filePath}
              alt={unitGroup.product.name}
              className="unit-image"
            />
            <div className="unit-info">
              <h4>{unitGroup.product.category}</h4>
              <p>Cantidad: {unitGroup.count}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EstadisUnidades;


