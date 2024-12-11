import React, { useState, useEffect } from "react";
import { Students } from "../../../api/DataApi";
import LoadingSpinner from "../../LoadingSpinner";
import BarChartComponentAreasQuinto from "./BarChartComponentAreasQuinto";
import LineChartComponentQuinto from "./LineChartComponentQuinto";
import DatatableAreasQuinto from "./DataTableAreaQuinto";
import FiltrosAreas5Informe from "./FiltrosAreas5Informe";

const Dashboardquinto = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [graphStudents, setGraphStudents] = useState([]);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedPeriodo, setSelectedPeriodo] = useState("acumulado");
  const [selectedScale, setSelectedScale] = useState("");
  const [selectedArea, setSelectedArea] = useState("ciencias_naturales");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const data = await Students();
        setStudents(data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching students");
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  useEffect(() => {
    // Filtrar datos para la tabla (período acumulado)
    let filtered = students;

    if (selectedGroup) {
      filtered = filtered.filter(
        (student) => student.grupo && student.grupo.trim() === selectedGroup
      );
    }

    if (selectedPeriodo) {
      filtered = filtered.filter(
        (student) =>
          student.periodo && student.periodo.trim() === selectedPeriodo
      );
    }

    if (selectedScale) {
      filtered = filtered.filter((student) => {
        const value = parseFloat(student[selectedArea]);
        let group;
        if (value < 3) {
          group = "DI";
        } else if (value < 4) {
          group = "BÁSICO";
        } else if (value < 4.6) {
          group = "DA";
        } else {
          group = "DS";
        }
        return group === selectedScale;
      });
    }

    if (selectedArea) {
      filtered = filtered.filter(
        (student) => student[selectedArea] !== undefined
      );
    }

    setFilteredStudents(filtered);
  }, [students, selectedGroup, selectedPeriodo, selectedScale, selectedArea]);

  useEffect(() => {
    // Filtrar datos para las gráficas (períodos específicos)
    const periodosGraficas = [
      "PERIODO 1",
      "PERIODO 2",
      "PERIODO 3",
      "PERIODO 4",
    ];
    let graphFiltered = students;

    if (selectedGroup) {
      graphFiltered = graphFiltered.filter(
        (student) => student.grupo && student.grupo.trim() === selectedGroup
      );
    }

    graphFiltered = graphFiltered.filter(
      (student) =>
        student.periodo && periodosGraficas.includes(student.periodo.trim())
    );

    if (selectedArea) {
      graphFiltered = graphFiltered.filter(
        (student) => student[selectedArea] !== undefined
      );
    }

    setGraphStudents(graphFiltered);
  }, [students, selectedGroup, selectedArea]);

  const calculateOverallAverage = () => {
    const periodosGraficas = [
      "PERIODO 1",
      "PERIODO 2",
      "PERIODO 3",
      "PERIODO 4",
    ];
    const validStudents = students.filter(
      (student) =>
        student[selectedArea] && periodosGraficas.includes(student.periodo)
    );
    if (validStudents.length === 0) return 0;

    const totalSum = validStudents.reduce((sum, student) => {
      return sum + parseFloat(student[selectedArea]);
    }, 0);

    return totalSum / validStudents.length;
  };

  const overallAverage = calculateOverallAverage();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="dashboard_div">
      <div className="dashboard_div_filtros">
        <FiltrosAreas5Informe
          selectedPeriodo={selectedPeriodo}
          setSelectedPeriodo={setSelectedPeriodo}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          selectedScale={selectedScale}
          setSelectedScale={setSelectedScale}
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
        />
        
      </div>

      <div className="graficas5informe">
        <BarChartComponentAreasQuinto
          students={graphStudents}
          selectedArea={selectedArea}
        />
        <div className="graficas5informe_line">
          <LineChartComponentQuinto
            students={graphStudents}
            selectedArea={selectedArea}
          />
        </div>

        <DatatableAreasQuinto
          students={filteredStudents}
          selectedArea={selectedArea}
          error={error}
        />
      </div>
    </div>
  );
};

export default Dashboardquinto;
