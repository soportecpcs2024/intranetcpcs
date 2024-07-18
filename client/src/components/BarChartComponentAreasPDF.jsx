import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";

const CustomTick = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="end" fill="#000" transform="rotate(-45)" fontSize={16}>
        {payload.value}
      </text>
    </g>
  );
};

const BarChartComponentAreasPDF = ({ students, selectedGroup, error }) => {
  // Filtrar estudiantes por grupo seleccionado
  const filteredStudents = students.filter(student => student.grupo.trim() === selectedGroup);

  // Definir alias para las áreas
  const areaAliases = {
    "ciencias_naturales": "C.Naturales",
    "fisica": "Física",
    "quimica": "Química",
    "ciencias_politicas_economicas": "C.Polit-econ",
    "ciencias_sociales": "C.Sociales",
    "civica_y_constitucion": "Civica Const",
    "educacion_artistica": "E. Artistica",
    "educacion_cristiana": "E. Cristiana",
    "educacion_etica": "E. ética",
    "educacion_fisica": "E. física",
    "filosofia": "Filosofía",
    "idioma_extranjero": "I. Extanjera",
    "lengua_castellana": "L. Castellana",
    "matematicas": "Matematicas",
    "tecnologia": "Técnologia"
  };

  // Calcular promedio del grupo en todas las áreas
  const areas = Object.keys(areaAliases); // Usar las claves del objeto de alias

  // Definir función para asignar colores basados en el promedio
  const getColor = (average) => {
    if (average < 3) {
      return "#FF5733"; // Rojo
    } else if (average < 4) {
      return "#808080"; // Gris
    } else if (average < 4.6) {
      return "#0088FE"; // Azul
    } else {
      return "#7cfc00"; // Verde
    }
  };

  const groupAverageData = areas
    .map((area, index) => {
      const areaSum = filteredStudents.reduce((total, student) => {
        return total + parseFloat(student[area] || 0);
      }, 0);
      const areaAverage = areaSum / filteredStudents.length || 0;

      return {
        area,
        alias: areaAliases[area], // Agregar alias al objeto de datos
        average: areaAverage.toFixed(2),  // Ajusta el formato del promedio
        percentage: ((areaAverage / 10) * 100).toFixed(0),
        fill: getColor(areaAverage), // Asignar color basado en el promedio
        isEmpty: areaAverage === 0  // Marca si el área tiene promedio 0
      };
    })
    .filter(data => !data.isEmpty); // Filtrar áreas con promedio 0

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ResponsiveContainer className="barChartDocument" width="100%" height={300}>
       
      <BarChart data={groupAverageData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <XAxis dataKey="alias" tick={<CustomTick />} interval={0} /> {/* Usar el alias en el eje X con tick personalizado */}
        <YAxis />
        <Tooltip />
        <Bar dataKey="average" fill="#8884d8">
          <LabelList
            dataKey="average"
            position="top"
            formatter={(value, entry) => `${value} (${entry.percentage}%)`}
            content={({ x, y, value }) => (
              <text x={x} y={y} dy={-20} dx={40}textAnchor="middle" fill="black" className="average-text">
                {value}
              </text>
            )}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponentAreasPDF;

