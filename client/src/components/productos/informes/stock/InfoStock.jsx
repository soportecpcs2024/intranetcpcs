import React, { useEffect, useState } from "react";
import { useProducts } from "../../../../contexts/ProductContext";
import { useProductStatistics } from "../../../../contexts/InformesContext";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import "./InforStock.css";

const InfoStock = () => {
  const { units, loadingUnits, errorUnits, fetchUnits } = useProducts();
  const [formattedUnits, setFormattedUnits] = useState([]);
  const [subcategoryData, setSubcategoryData] = useState([]);
  const [totalCostUnits, setTotalCostUnits] = useState(0);
  const [totalCostCategories, setTotalCostCategories] = useState({});

  const {
    statistics,
    loadingStatistics,
    errorStatistics,
    fetchProductStatistics,
  } = useProductStatistics();

  // Extracting statistics for categories and subcategories
  const categorias = statistics?.estadisticas || [];
  const totalCategorias = statistics?.totalCategorias || 0;

  // Fetch data when the component mounts
  useEffect(() => {
    fetchUnits(); // Always fetch units on mount
    fetchProductStatistics(); // Always fetch statistics on mount
  }, [fetchUnits, fetchProductStatistics]);

  // Process the units data once fetched
  useEffect(() => {
    if (units && units.length > 0) {
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

      const totalCost = formatted.reduce(
        (acc, unit) => acc + (unit.id_producto.price || 0),
        0
      );
      setTotalCostUnits(totalCost);

      const categoryStats = formatted.reduce((acc, unit) => {
        const category = unit.id_producto?.category || "Desconocido";
        if (!acc[category]) {
          acc[category] = { count: 0, cost: 0 };
        }
        acc[category].count += 1;
        acc[category].cost += unit.price || 0;
        return acc;
      }, {});

      const totalUnits = formatted.length;

      const subcategoryDataFormatted = Object.keys(categoryStats).map(
        (subcategory) => ({
          name: subcategory,
          value: categoryStats[subcategory].count,
          percentage: (
            (categoryStats[subcategory].count / totalUnits) *
            100
          ).toFixed(2),
        })
      );

      setSubcategoryData(subcategoryDataFormatted);
      setTotalCostCategories(categoryStats);
    }
  }, [units]);

  if (loadingUnits || loadingStatistics) return <div>Cargando...</div>;
  if (errorUnits || errorStatistics) return <div>Error al cargar datos.</div>;

  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
  ];

  const renderCustomizedLabel = ({ cx, cy, midAngle, name, percentage }) => {
    const radius = 170;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    return (
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: "16px" }}
      >
        {`${name}: ${percentage}%`}
      </text>
    );
  };

  return (
    <div className="container-info-inventario">
      <h2>Stock de inventario CPCS</h2>
      <div className="container_info_unidad-header">
        <h4>Estadisticas por categoria:</h4>
        <p>
          Permite ver porcentajes, cantidades y valores de las categoría de
          productos.
        </p>
      </div>

      <div className="container-info-inventario-content">
        <div className="box-info-inventario">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={subcategoryData}
                innerRadius={50}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={renderCustomizedLabel}
                labelLine={false}
              >
                {subcategoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [
                  `${((value / formattedUnits.length) * 100).toFixed(2)}%`,
                  name,
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="box-info-inventario">
          <div className="box-info-inventario-units">
            <h2 className="box-info-inventario-units-title">
              Total Categorías: <span>{totalCategorias}</span>
            </h2>
            {categorias.map((categoria, index) => (
              <div key={index} className="box-info-inventario-units-category">
                <p>
                  <strong>Categoría:</strong> <span>{categoria.categoria}</span>
                </p>
                <p className="strong-unidades">
                  Total Unidades: {categoria.totalUnidadesPorCategoria}
                </p>
                <p>
                  Total Precio:{" "}
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(categoria.totalPrecioPorCategoria)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoStock;
