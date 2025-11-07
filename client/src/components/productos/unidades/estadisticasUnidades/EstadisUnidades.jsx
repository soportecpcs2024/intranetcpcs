import React, { useEffect, useState } from "react";
import { useProducts } from "../../../../contexts/ProductContext";
import "./EstadisUnidades.css";
import imgInmueble from "../../../../assets/png/2.png";
 
import { FaKitchenSet } from "react-icons/fa6";
import { GrTechnology } from "react-icons/gr";
import { SiLibreofficewriter } from "react-icons/si";

const EstadisUnidades = () => {
  const { units } = useProducts();
  const [unitCounts, setUnitCounts] = useState([]);

  useEffect(() => {
    if (units && units.length > 0) {
      const groupedUnits = units.reduce((acc, unit) => {
        const product = unit.id_producto;
        const productCategory = product?.category;

        if (productCategory && product) {
          if (!acc[productCategory]) {
            acc[productCategory] = {
              count: 0,
              product: product,
            };
          }
          acc[productCategory].count += 1;
        }
        return acc;
      }, {});

      setUnitCounts(Object.values(groupedUnits));
    }
  }, [units]);

  // 🔹 Retornamos un componente o una imagen según la categoría
  const getCategoryVisual = (category) => {
    switch (category) {
      case "Tecnología":
        return <GrTechnology className="unit-icon" size={50} color="#007bff" />;
      case "Electrodoméstico":
        return  <FaKitchenSet className="unit-icon" size={50} />;
      case "Inmueble":
        return <SiLibreofficewriter className="unit-icon" size={50} />
      default:
        return (
          <img
            src="/path/to/default-image.jpg"
            alt="Imagen no disponible"
            className="unit-image"
          />
        );
    }
  };

  return (
    <div className="card-container-units">
      {unitCounts.length === 0 ? (
        <p>No hay unidades disponibles.</p>
      ) : (
        unitCounts.map((unitGroup, index) => (
          <div key={index} className="unit-card">
            <div className="unit-visual">
              {getCategoryVisual(unitGroup.product?.category)}
            </div>
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
