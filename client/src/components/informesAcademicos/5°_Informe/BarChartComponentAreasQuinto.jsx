import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts";

const BarChartComponentAreasQuinto = ({ students, selectedArea }) => {
  // Calcular promedios por período
  const periodos = ["PERIODO 1", "PERIODO 2", "PERIODO 3", "PERIODO 4"];
  const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"]; // Colores diferentes para las barras

  const data = periodos.map((periodo, index) => {
    const studentsInPeriod = students.filter((student) => student.periodo === periodo);
    const total = studentsInPeriod.reduce((sum, student) => sum + (parseFloat(student[selectedArea]) || 0), 0);
    const average = studentsInPeriod.length ? total / studentsInPeriod.length : 0;
    return {
      periodo,
      promedio: parseFloat(average.toFixed(2)), // Convertir a número para que LabelList lo interprete correctamente
      fill: colors[index], // Asignar un color único a cada período
    };
  });

  return (
    <div
      style={{
        width: "48%",
        height: 400,
        backgroundColor: "#f8f9fa",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h3 style={{ textAlign: "center", marginBottom: "20px", color: "#343a40" }}>Promedios por Periodo</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="periodo" tick={{ fontSize: 14, fontWeight: "bold" }} />
          <YAxis tick={{ fontSize: 14, fontWeight: "bold" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #d9d9d9",
              borderRadius: "5px",
            }}
          />
          <Legend />
          <Bar dataKey="promedio" barSize={50}>
            <LabelList dataKey="promedio" position="top" style={{ fill: "#000", fontSize: 14, fontWeight: "bold" }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponentAreasQuinto;


 
