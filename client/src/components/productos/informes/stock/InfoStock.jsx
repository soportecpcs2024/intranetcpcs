import React, { useEffect, useState } from "react";
import { useProducts } from "../../../../contexts/ProductContext";
import { Link } from "react-router-dom";
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import ReactPaginate from "react-paginate";
import { confirmAlert } from "react-confirm-alert";
import "./InforStock.css";

const InfoStock = () => {
  const { units, loadingUnits, errorUnits, removeUnit, fetchUnits } =
    useProducts();
  const [formattedUnits, setFormattedUnits] = useState([]);
  const [productStats, setProductStats] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 12;

  // Agrupar por subcategoría
  const [subcategoryData, setSubcategoryData] = useState([]);

  useEffect(() => {
    console.log("Units loaded:", units); // Verifica la carga de las unidades
    if (units) {
      const formatted = units.map((unit) => ({
        ...unit,
        fecha_entrega: unit.fecha_entrega
          ? new Date(unit.fecha_entrega).toLocaleDateString()
          : "N/A",
        fecha_devolucion: unit.fecha_devolucion
          ? new Date(unit.fecha_devolucion).toLocaleDateString()
          : "N/A",
      }));
      setFormattedUnits(formatted);

      // Agrupar por subcategoría y contar
      const categoryStats = formatted.reduce((acc, unit) => {
        const category = unit.id_producto?.category || "Desconocido";
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += 1;
        return acc;
      }, {});

      // Formatear para Recharts
      const subcategoryDataFormatted = Object.keys(categoryStats).map(
        (subcategory) => ({
          name: subcategory,
          value: categoryStats[subcategory],
        })
      );
      setSubcategoryData(subcategoryDataFormatted);

      setProductStats(categoryStats); // Guardar estadísticas
    }
  }, [units]);

  // Paginación
  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;

    // Filtrar unidades basadas en el término de búsqueda
    const filteredUnits = formattedUnits.filter((unit) => {
      const name = unit.id_producto?.name?.toLowerCase() || "";
      const category = unit.id_producto?.category?.toLowerCase() || "";
      const subcategory = unit.id_producto?.subcategory?.toLowerCase() || "";
      const idunit = unit._id?.toLowerCase() || "";
      const locationName = unit.location?.nombre?.toLowerCase() || "";
      const locationAddress = unit.location?.direccion?.toLowerCase() || "";
      const searchTermLower = searchTerm.toLowerCase();

      return (
        name.includes(searchTermLower) ||
        category.includes(searchTermLower) ||
        subcategory.includes(searchTermLower) ||
        idunit.includes(searchTermLower) ||
        locationName.includes(searchTermLower) ||
        locationAddress.includes(searchTermLower)
      );
    });

    setCurrentItems(filteredUnits.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredUnits.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, formattedUnits, searchTerm]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % formattedUnits.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    if (!loadingUnits && units.length === 0) {
      fetchUnits(); // Forzar la recarga de productos si no se están cargando
    }
  }, [loadingUnits, units, fetchUnits]);

  if (loadingUnits) return <div>Cargando...</div>;
  if (errorUnits) return <div>Error al cargar unidades.</div>;

  // Colores para la gráfica
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
  ];

  return (
    <div className="container">
      <h3>Información stock</h3>

      <div>
        {/* Gráfico de pastel basado en la subcategoría */}
        <div className="pie-chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={subcategoryData}
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {subcategoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="totalunidades">
        <div>{/* Componente de búsqueda */}</div>
        <div className="container-listUnits-Search-ps">
          <div>
            <p>Total Unidades: </p>
          </div>

          <div className="">
            <p>{formattedUnits.length}</p>
          </div>
        </div>
      </div>

     

     
    </div>
  );
};

export default InfoStock;
