import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, LineElement, PointElement, Filler } from "chart.js";

// Registra los elementos de Chart.js
ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, LineElement, PointElement, Filler);

const LineChartComponentQuinto = ({ students, selectedArea }) => {
  // Calcular promedios por período
  const periodos = ["PERIODO 1", "PERIODO 2", "PERIODO 3", "PERIODO 4"];
  const labels = periodos;

  const data = periodos.map((periodo) => {
    const studentsInPeriod = students.filter((student) => student.periodo === periodo);
    const total = studentsInPeriod.reduce((sum, student) => sum + (parseFloat(student[selectedArea]) || 0), 0);
    return studentsInPeriod.length ? total / studentsInPeriod.length : 0;
  });

  // Datos de "dataClose" o línea adicional que puedes ajustar si es necesario
  const dataClose = [21.02, 7.92, 1.73, 3.65]; // Si tienes datos diferentes, ajústalos

  const chartData = {
    labels: labels, // Etiquetas para el eje X (Períodos)
    datasets: [
      {
        label: "Promedios por Periodo", // Etiqueta para la línea
        data: data, // Datos calculados
        fill: false, // No llenar debajo de la línea
        borderColor: "rgb(75, 192, 192)", // Color de la línea
        tension: 0.1, // Curvatura de la línea
        borderWidth: 3, // Grosor de la línea
        pointRadius: 5, // Radio de los puntos de la línea
        pointHoverRadius: 7, // Radio de los puntos cuando se pasa el mouse
        pointBackgroundColor: "rgb(75, 192, 192)", // Color de fondo de los puntos
      },
      {
        label: "Cierre", // Línea adicional para los datos de "dataClose"
        data: data,
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: "rgb(255, 99, 132)",
      },
    ],
  };

  return (
    <div className="chart-container" style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Promedios por Período</h2>
      <Line
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Promedio por período (Comparativa)", // Título del gráfico
            },
            legend: {
              display: true, // Mostrar leyenda
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Períodos", // Título del eje X
              },
            },
            y: {
              title: {
                display: true,
                text: "Promedio", // Título del eje Y
              },
            },
          },
        }}
      />
    </div>
  );
};

export default LineChartComponentQuinto;
