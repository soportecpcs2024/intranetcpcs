import React, { useEffect, useState } from "react";
import { useProducts } from "../../../../contexts/ProductContext";

import imgTecnologia from "../../../../assets/png/1.png";
import imgInmueble from "../../../../assets/png/2.png";
import imgElectrodomestico from "../../../../assets/png/3.png";
import "./SubCategory.css";
import { useProductStatistics } from "../../../../contexts/InformesContext";

const SubCategory = () => {
  const { units } = useProducts();
  const [unitCounts, setUnitCounts] = useState([]);
  const {
    statistics,
    loadingStatistics,
    errorStatistics,
    fetchProductStatistics,
  } = useProductStatistics();
  const [selectedCategory, setSelectedCategory] = useState(null); // Estado para la categoría seleccionada

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

  // Función para obtener la imagen basada en la categoría
  const getCategoryImage = (category) => {
    switch (category) {
      case "Tecnología":
        return imgTecnologia; // Imagen 1 para Tecnología
      case "Electrodoméstico":
        return imgElectrodomestico; // Imagen 2 para Electrodoméstico
      case "Inmueble":
        return imgInmueble; // Imagen 3 para Inmueble
      default:
        return "/path/to/default-image.jpg"; // Imagen por defecto
    }
  };

  // Función para manejar el clic en la imagen
  const handleImageClick = (category) => {
    console.log(category); // Muestra la categoría en la consola
    setSelectedCategory(category); // Establece la categoría seleccionada
  };

  // Filtrar las subcategorías según la categoría seleccionada
  const getSubcategoriesByCategory = (category) => {
    const categoryStats = statistics?.estadisticas.find(
      (stat) => stat.categoria === category
    );
    return categoryStats ? categoryStats.subcategorias : [];
  };

  // Función para formatear el precio en formato numérico
  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className="containersubcategory">
      <div className="container_info_unidad-header">
        <h4>Estadisticas por sub categoria:</h4>
        <p>
          Permite ver porcentajes, cantidades y valores de las sub categoría de
          productos.
        </p>
      </div>

      <div className="containersubcategory-category">
        {unitCounts.length === 0 ? (
          <p>No hay unidades disponibles.</p>
        ) : (
          unitCounts.map((unitGroup, index) => (
            <div key={index} className="unit-card">
              {unitGroup.product ? (
                <img
                  src={getCategoryImage(unitGroup.product.category)} // Llamamos a la función para obtener la imagen correcta
                  alt={unitGroup.product.name}
                  className="unit-image"
                  onClick={() => handleImageClick(unitGroup.product.category)} // Manejador de clic
                />
              ) : (
                <img
                  src="/path/to/default-image.jpg" // Reemplaza con la ruta de una imagen por defecto si no hay producto
                  alt="Imagen no disponible"
                  className="unit-image"
                  onClick={() => handleImageClick("Desconocido")} // Manejador de clic para imagen por defecto
                />
              )}
              <div className="unit-info">
                <h4>{unitGroup.product.category}</h4>
                <p>Unidades: {unitGroup.count}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="containersubcategory-category-info">
        {selectedCategory && (
          <div className="subcategory-list">
            <h3>Categoría de {selectedCategory}:</h3>
            <ul>
              <p>Subcategoría:</p>
              {getSubcategoriesByCategory(selectedCategory).map(
                (subcategory, index) => (
                  <li key={index} className="subcategory-list-card">
                    <div>
                      <p>
                        {" "}
                        <span>{subcategory.subcategoria}</span>{" "}
                      </p>
                      Unidades: <span>{subcategory.totalUnidades}</span>{" "}
                    </div>
                    {/* Aquí se formatea el totalPrecio con la función formatPrice */}
                    TOTAL: {formatPrice(subcategory.totalPrecio)}
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubCategory;
