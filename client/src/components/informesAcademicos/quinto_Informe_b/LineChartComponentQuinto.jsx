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
        label: " ", // Etiqueta para la línea
        data: data, // Datos calculados
        fill: false, // No llenar debajo de la línea
        borderColor: "rgb(75, 192, 192)", // Color de la línea
        tension: 0.1, // Curvatura de la línea
        borderWidth: 1, // Grosor de la línea
        pointRadius: 5, // Radio de los puntos de la línea
        pointHoverRadius: 7, // Radio de los puntos cuando se pasa el mouse
        pointBackgroundColor: "rgb(75, 192, 192)", // Color de fondo de los puntos
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.76)",
      },
      
    ],
  };

  return (
    <div className="chart-container" style={{ padding: "10px",  }}>
       
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
