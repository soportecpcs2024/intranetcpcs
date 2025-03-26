import React, { useState, useEffect, useMemo } from "react";
import { Students } from "../../../api/DataApi";
import LoadingSpinner from "../../LoadingSpinner";
import BarChartComponentAreasQuinto from "./BarChartComponentAreasQuinto";
import LineChartComponentQuinto from "./LineChartComponentQuinto";
import FiltrosAreas5Informe from "./FiltrosAreas5Informe";
import './quintoinforme.css';

const Dashboardquinto = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState("1. A"); // Default set to "1. A"
  const [selectedPeriodo, setSelectedPeriodo] = useState("acumulado");
  const [selectedScale, setSelectedScale] = useState("");
  const [selectedArea, setSelectedArea] = useState("ciencias_naturales");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInitialStudents() {
      try {
        const data = await Students();
        const filteredData = data.filter(
          (student) => student.grupo && student.grupo.trim() === "1. A"
        );
        setStudents(filteredData);
        setLoading(false);

        // Fetch additional data after 3 seconds
        setTimeout(async () => {
          try {
            const additionalData = await Students();
            setStudents(additionalData);
          } catch (error) {
            setError("Error fetching additional students");
          }
        }, 3000);
      } catch (error) {
        setError("Error fetching students");
        setLoading(false);
      }
    }

    fetchInitialStudents();
  }, []);

  // Filtrar datos para la tabla, memoizando el cálculo
  const filteredStudents = useMemo(() => {
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

    return filtered;
  }, [students, selectedGroup, selectedPeriodo, selectedScale, selectedArea]);

  // Filtrar datos para las gráficas, memoizando el cálculo
  const graphStudents = useMemo(() => {
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

    return graphFiltered;
  }, [students, selectedGroup, selectedArea]);

  const calculateOverallAverage = useMemo(() => {
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
  }, [students, selectedArea]);

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

      <div className="graficas_5_informe">
        <div className="box-graficas">
          <BarChartComponentAreasQuinto
            students={graphStudents}
            selectedArea={selectedArea}
          />
        </div>

        <div className="box-graficas">
          <LineChartComponentQuinto
            students={graphStudents}
            selectedArea={selectedArea}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboardquinto;
