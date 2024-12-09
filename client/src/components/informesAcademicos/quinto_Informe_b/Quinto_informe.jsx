import React, { useState, useEffect } from "react";

import { Students } from "../../../api/DataApi";
import FiltrosAreas5Informe from "./FiltrosAreas5Informe";
import LoadingSpinner from "../../LoadingSpinner";
import BarChartComponentAreasQuinto from "./BarChartComponentAreasQuinto";
import LineChartComponentQuinto from "./LineChartComponentQuinto";
import "./quintoinforme.css";
const Quinto_informe = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedArea, setSelectedArea] = useState("ciencias_naturales");

  useEffect(() => {
    async function fetchStudents() {
      try {
        const data = await Students();
        setStudents(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching students:", error);
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  useEffect(() => {
    let filtered = students;

    if (selectedGroup) {
      filtered = filtered.filter(
        (student) => student.grupo && student.grupo.trim() === selectedGroup
      );
    }

    setFilteredStudents(filtered);
  }, [students, selectedGroup]);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Calcular promedio general de los 4 períodos
  const periodos = ["PERIODO 1", "PERIODO 2", "PERIODO 3", "PERIODO 4"];
  const averages = periodos.map((periodo) => {
    const studentsInPeriod = filteredStudents.filter(
      (student) => student.periodo === periodo
    );
    const total = studentsInPeriod.reduce(
      (sum, student) => sum + (parseFloat(student[selectedArea]) || 0),
      0
    );
    return studentsInPeriod.length ? total / studentsInPeriod.length : 0;
  });
  const overallAverage =
    averages.reduce((sum, avg) => sum + avg, 0) / periodos.length;

  return (
    <div className="dashboard_div">
      <div className="dashboard_div_filtros">
        <FiltrosAreas5Informe
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
        />
      </div>
      <h3>Promedio General: {overallAverage.toFixed(2)}</h3>
      <div className="graficas5informe">
        <BarChartComponentAreasQuinto
          students={filteredStudents}
          selectedArea={selectedArea}
        />

        <div className="graficas5informe_line">
          <LineChartComponentQuinto
            students={filteredStudents}
            selectedArea={selectedArea}
          />
        </div>
      </div>
    </div>
  );
};

export default Quinto_informe;
