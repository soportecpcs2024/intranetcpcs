import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from 'recharts';

const BarChartComponent = ({ students = [], error = null }) => {
  // Agrupar estudiantes por grupo y calcular el promedio de cada grupo
  const groupedData = students.reduce((accumulator, student) => {
    const group = student.grupo.trim();
    const promedio = parseFloat(student.promedio); // Asegurarse de que el promedio sea un número

    if (!accumulator[group]) {
      accumulator[group] = { totalPromedio: 0, count: 0 };
    }

    if (!isNaN(promedio)) { // Solo agregar si el promedio es un número válido
      accumulator[group].totalPromedio += promedio;
      accumulator[group].count += 1;
    }

    return accumulator;
  }, {});

  // Formatear datos para Recharts
  const data = Object.keys(groupedData).map(group => ({
    name: group,
    average: (groupedData[group].totalPromedio / groupedData[group].count).toFixed(1),
    count: groupedData[group].count
  }));

  // Colores para las barras del gráfico
  const colors = ['#FE0211', '#6C69AC', '#0247FE', '#7cfc00'];

  // Función para definir estilos personalizados de las barras
  const customBarStyle = (index) => ({
    fill: colors[index % colors.length],
    stroke: '#333',
    strokeWidth: 1,
    opacity: 0.8,
  });

  return (
    <div className="bar-chart-container">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="average" name="Promedios por Grupos">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} {...customBarStyle(index)} />
            ))}
            <LabelList dataKey="average" position="top" formatter={(value) => `${value}`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {error && (
        <div className="error-row">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default BarChartComponent;
