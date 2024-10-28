import React, { useState } from "react";
import { useProducts } from "../../../../contexts/ProductContext";
import * as XLSX from "xlsx";
import "./InformeUnidad.css";

const InformeUnidad = () => {
  const { units, loadingUnits, errorUnits } = useProducts();

  // Lista de todos los campos posibles para exportar
  const fields = [
    { label: "ID Unidad", key: "_id" },
    { label: "Producto", key: "id_producto.name" },
    { label: "Marca", key: "id_producto.brand" },
    { label: "SKU", key: "id_producto.sku" },
    { label: "Categoría", key: "id_producto.category" },
    { label: "Modelo", key: "id_producto.model" },
    { label: "Dimensiones", key: "id_producto.dimensions" },
    { label: "Precio", key: "id_producto.price" },
    { label: "Color", key: "id_producto.color" },
    { label: "Descripción", key: "id_producto.description" },
    { label: "Fecha de Compra", key: "id_producto.purchase_date" },
    { label: "Vida Útil (años)", key: "id_producto.useful_life" },
    { label: "Depreciación Anual", key: "id_producto.depreciation" },
    { label: "Ubicación", key: "location.nombre" },
    { label: "Dirección Ubicación", key: "location.direccion" },
    { label: "Estado Unidad", key: "estado" },
    { label: "Entregado por", key: "entregado_por" },
    { label: "Recibido por", key: "recibido_por" },
    { label: "Aprobado por", key: "aprobado_por" },
    { label: "Fecha de Entrega", key: "fecha_entrega" },
    { label: "Observaciones", key: "observaciones" },
  ];

  // Estado para los campos seleccionados
  const [selectedFields, setSelectedFields] = useState([]);

  // Función para manejar la selección de campos
  const handleCheckboxChange = (key) => {
    setSelectedFields((prevSelected) =>
      prevSelected.includes(key)
        ? prevSelected.filter((field) => field !== key)
        : [...prevSelected, key]
    );
  };

  // Función para exportar los datos seleccionados a Excel
  const handleExportToExcel = () => {
    if (selectedFields.length === 0) {
      alert("Por favor, selecciona al menos un campo para exportar.");
      return;
    }

    // Filtrar los datos de units basado en los campos seleccionados
    const dataToExport = units.map((unit) => {
      const filteredData = {};
      selectedFields.forEach((field) => {
        const fieldKeys = field.split(".");
        const value = fieldKeys.reduce((acc, key) => acc && acc[key], unit);
        filteredData[fields.find((f) => f.key === field).label] = value;
      });
      return filteredData;
    });

    // Crear un libro de trabajo y una hoja de trabajo
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Informe Unidades");

    // Generar el archivo Excel
    XLSX.writeFile(workbook, "Informe_Unidades.xlsx");
  };

  return (
    <div className="container_info_unidad">
      <div className="container_info_unidad-h3">
        <h2>Informe detallado de Unidades</h2>
      </div>
      {loadingUnits && <p>Cargando unidades...</p>}
      {errorUnits && <p>Error al cargar unidades: {errorUnits}</p>}
      <div className="container_info_unidad-header">
        <h4>Selecciona los campos a exportar:</h4>
        <p>
          Permite expotar un archivo de Excel la información de las unidades
          según los campos requeridos
        </p>
      </div>

      <div className="container_info_unidad_checks">
        {fields.map((field) => (
          <div key={field.key} className="container_info_unidad_checks_list">
            <input
              type="checkbox"
              id={field.key}
              checked={selectedFields.includes(field.key)}
              onChange={() => handleCheckboxChange(field.key)}
            />
            <label htmlFor={field.key}>{field.label}</label>
          </div>
        ))}
      </div>

      <button onClick={handleExportToExcel}>Exportar a Excel</button>
    </div>
  );
};

export default InformeUnidad;
