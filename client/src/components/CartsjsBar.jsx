 
import { Bar } from 'react-chartjs-2';

const BarChartComponent = ({ students, error }) => {
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

  // Formatear datos para Chart.js
  const labels = Object.keys(groupedData);
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Promedios por Grupos',
        data: labels.map(group => (groupedData[group].totalPromedio / groupedData[group].count).toFixed(1)),
        backgroundColor: [
          '#FE0211',
          '#6C69AC',
          '#0247FE',
          '#7cfc00'
        ],
        borderColor: '#333',
        borderWidth: 1,
        opacity: 0.8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bar-chart-container">
      {error && (
        <div className="error-row">
          <p>{error}</p>
        </div>
      )}
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChartComponent;
