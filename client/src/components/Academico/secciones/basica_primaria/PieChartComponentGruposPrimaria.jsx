import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

const PieChartComponentGruposPrimaria = ({ data = [], error }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <p>No hay datos disponibles para mostrar.</p>;
  }

  // Clasifica cada estudiante según su promedio
  const groupedData = data.reduce((acc, student) => {
    const value = parseFloat(student.promedio);
    if (!isNaN(value)) {
      let group;
      if (value < 3) {
        group = 'DI';
      } else if (value < 4) {
        group = 'BÁSICO';
      } else if (value < 4.6) {
        group = 'DA';
      } else {
        group = 'DS';
      }
      acc[group] = (acc[group] || 0) + 1;
    }
    return acc;
  }, {});

  const total = Object.values(groupedData).reduce((acc, val) => acc + val, 0);

  const chartData = Object.keys(groupedData).map(group => ({
    name: group,
    value: groupedData[group],
    percentage: ((groupedData[group] / total) * 100).toFixed(0),
    count: groupedData[group]
  }));

  const colors = {
    DI: '#e74c3c',      // rojo
    'BÁSICO': '#f39c12', // naranja
    DA: '#3498db',      // azul
    DS: '#2ecc71'       // verde
  };

  return (
    <div className="pie-chart-container">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            innerRadius={40}
            outerRadius={60}
            fill="#8884d8"
            paddingAngle={6}
            dataKey="value"
            label={({ name, percentage, count }) =>
              `${count} ${name} (${percentage}%)`
            }
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[entry.name] || '#ccc'} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {error && (
        <div className="error-row">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default PieChartComponentGruposPrimaria;
