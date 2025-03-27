import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";

const BarChartComponent = ({ students = [], error = null, isScaleChart = false }) => {
  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!students.length) {
    return <p>No hay datos disponibles</p>;
  }

  let data;
  if (isScaleChart) {
    data = ["DI", "BÁSICO", "DA", "DS"].map((scale) => {
      const count = students.filter((student) => {
        let group;
        if (student.promedio < 3) {
          group = "DI";
        } else if (student.promedio < 4) {
          group = "BÁSICO";
        } else if (student.promedio < 4.6) {
          group = "DA";
        } else {
          group = "DS";
        }
        return group === scale;
      }).length;

      return { name: scale, value: count };
    });
  } else {
    data = students.map((student) => ({
      name: student.nombre || "Desconocido",
      value: student.promedio || 0,
    }));
  }

  const COLORS = {
    DI: "red",
    BÁSICO: "#ff9933",
    DA: "#33a8ff",
    DS: "#25e107",
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }} 
          tickLine={false} // Opcional: Ocultar línea de marca de ticks
        />
        <YAxis 
          domain={[0, "auto"]} 
          tickFormatter={(value) => value.toFixed(0)} // Evita valores decimales
          tickLine={false} 
        />
        <Tooltip />
        <Bar dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.name] || "#8884d8"} />
          ))}
          <LabelList dataKey="value" position="top" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
