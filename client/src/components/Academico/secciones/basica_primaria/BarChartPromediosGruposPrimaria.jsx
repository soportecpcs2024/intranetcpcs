
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from 'recharts';

const BarChartPromediosGruposPrimaria = ({ data }) => {
  // Agrupar estudiantes por grupo y calcular promedio
  const groupedData = data.reduce((accumulator, item) => {
    const group = item.grupo.trim();
    const promedio = parseFloat(item.promedio);

    if (!accumulator[group]) {
      accumulator[group] = { totalPromedio: 0, count: 0 };
    }

    if (!isNaN(promedio)) {
      accumulator[group].totalPromedio += promedio;
      accumulator[group].count += 1;
    }

    return accumulator;
  }, {});

  // Formatear datos para Recharts
  const chartData = Object.entries(groupedData).map(([grupo, { totalPromedio, count }]) => ({
    name: grupo,
    average: (totalPromedio / count).toFixed(2),
    count,
  }));

  const colors = ['#FE0211', '#6C69AC', '#0247FE', '#7cfc00', '#ffa500', '#00ced1', '#ff69b4'];

  const customBarStyle = (index) => ({
    fill: colors[index % colors.length],
    stroke: '#333',
    strokeWidth: 1,
    opacity: 0.85,
  });

  return (
    <div className="bar-chart-container">
      <h4 style={{ textAlign: 'center', marginBottom: '1rem' }}>Promedio por Grupo</h4>
      <ResponsiveContainer width="100%" height={230}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="average" name="Promedio">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} {...customBarStyle(index)} />
            ))}
            <LabelList dataKey="average" position="top" formatter={(value) => `${value}`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartPromediosGruposPrimaria