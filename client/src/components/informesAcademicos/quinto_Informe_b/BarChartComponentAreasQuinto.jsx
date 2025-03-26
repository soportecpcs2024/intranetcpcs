import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const BarChartComponentAreasQuinto = ({ students, selectedArea }) => {
  const periodos = ["PERIODO 1", "PERIODO 2", "PERIODO 3", "PERIODO 4"];
  const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"];

  const data = periodos.map((periodo, index) => {
    const studentsInPeriod = students.filter((student) => student.periodo === periodo);
    const total = studentsInPeriod.reduce((sum, student) => sum + (parseFloat(student[selectedArea]) || 0), 0);
    const average = studentsInPeriod.length ? total / studentsInPeriod.length : 0;
    return {
      periodo,
      promedio: parseFloat(average.toFixed(2)),
      fill: colors[index],
    };
  });

  // Calculate overall average across all periods
  const overallAverage =
    data.reduce((sum, item) => sum + item.promedio, 0) / periodos.length;

  return (
    <div
      style={{
        width: "100%",
        height: 350,
        backgroundColor: "#f8f9fa",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.76)",
      }}
    >
     
      <h3 style={{ textAlign: "center", color: "#007BFF" }}>
        Promedio Total: {overallAverage.toFixed(2)}
      </h3>
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
            <LabelList
              dataKey="promedio"
              position="top"
              style={{ fill: "#000", fontSize: 14, fontWeight: "bold" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponentAreasQuinto;
