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
  Cell,
  LabelList,
} from "recharts";
import "./dashboardNS.css";

const getAreaName = (area) => {
  const areaNames = {
    ciencias_naturales: "Ciencias Naturales",
    fisica:"Física",
    quimica:"Química",
    ciencias_politicas_economicas: "Ciencias Políticas y Económicas",
    ciencias_sociales: "Ciencias Sociales",
    civica_y_constitucion: "Cívica y Constitución Política",
    educacion_artistica: "Educación artística",
    educacion_cristiana: "Educación Cristiana",
    educacion_etica: "Etica",
    educacion_fisica: "Edicacion física",
    filosofia:"Filosofía",
    idioma_extranjero: "Idioma Extrangero",
    lengua_castellana: "Lengua Castellana",
    matematicas: "Matemáticas",
    tecnologia:"Tecnología"
  };
  return areaNames[area] || area;
};

const BarChartComponentNS = ({
  students,
  selectedArea,
  error,
  selectedGroup,
}) => {
  const uniqueStudents = Array.from(
    new Set(students.map((student) => student.codigo))
  );
  const uniqueStudentsData = uniqueStudents.map((codigo) =>
    students.find((student) => student.codigo === codigo)
  );
  const filteredStudents = selectedArea
    ? uniqueStudentsData.filter(
        (student) => student[selectedArea] !== undefined
      )
    : uniqueStudentsData;

  const groupedData = filteredStudents.reduce((accumulator, student) => {
    let group;
    const value = parseFloat(student[selectedArea]);

    if (value < 3) {
      group = null;
    } else if (value < 4) {
      group = null;
    } else if (value < 4.6) {
      group = "DA";
    } else {
      group = "DS";
    }

    if (group) {
      accumulator[group] = (accumulator[group] || 0) + 1;
    }
    return accumulator;
  }, {});

  const data = Object.keys(groupedData).map((group) => ({
    name: group,
    num_estudiantes: groupedData[group],
  }));

  const hasNonZeroValues = data.some((entry) => entry.num_estudiantes > 0);
  if (!hasNonZeroValues) {
    return null;
  }

  const getColor = (group) => {
    switch (group) {
      case "DS":
        return "#33fc02";
      case "DA":
        return "#0247FE";
      default:
        return "#8884d8";
    }
  };

  return (
    <div className="bar-chart-container-ns">
      <div className="bar-chart-container-ns-title">
        <h3>{getAreaName(selectedArea)}</h3>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ padding: 15 }} />
          <YAxis tick={{ padding: 15 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="num_estudiantes">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
            ))}
            <LabelList
              dataKey="num_estudiantes"
              position="top"
              style={{
                fill: "black",
                fontSize: 14,
                fontWeight: "bold",
                textAnchor: "middle",
              }}
            />
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

export default BarChartComponentNS;
