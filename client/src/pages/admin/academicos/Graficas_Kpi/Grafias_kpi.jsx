import { useState, useEffect, useRef } from "react";
import { Students } from "../../../../api/DataApi";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import FiltrosAreasDocumentos from "../../../../components/FiltrosAreasDocumentos";
import BarChartGrafiasKPI from "./BarChartGrafiasKPI";
import Filtros_grafica from "./Filtros_grafica";
 


const GrafiasKpi = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [error, setError] = useState(null);

  const [selectedGroup, setSelectedGroup] = useState("1. A");
 
  const [selectedScale, setSelectedScale] = useState("");
  const [selectedArea, setSelectedArea] = useState("ciencias_naturales");

  const [loading, setLoading] = useState(true);

  const [groupCounts, setGroupCounts] = useState({
    DI: 0,
    BÁSICO: 0,
    DA: 0,
    DS: 0,
  });

  const contentRef = useRef(null);

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
    let filtered = [...students];

    if (selectedGroup) {
      filtered = filtered.filter(
        (student) => student.grupo?.trim() === selectedGroup
      );
    }

    

    if (selectedArea) {
      filtered = filtered.filter(
        (student) => student[selectedArea] !== undefined
      );
    }

    if (selectedScale) {
      filtered = filtered.filter((student) => {
        const value = parseFloat(student[selectedArea]);

        if (isNaN(value)) return false;

        let group = "";

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

    setFilteredStudents(filtered);

    const counts = {
      DI: 0,
      BÁSICO: 0,
      DA: 0,
      DS: 0,
    };

    filtered.forEach((student) => {
      const value = parseFloat(student[selectedArea]);

      if (isNaN(value)) return;

      if (value < 3) {
        counts.DI++;
      } else if (value < 4) {
        counts.BÁSICO++;
      } else if (value < 4.6) {
        counts.DA++;
      } else {
        counts.DS++;
      }
    });

    setGroupCounts(counts);
  }, [students, selectedGroup,   selectedScale, selectedArea]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const totalFilteredStudents = filteredStudents.length;

  const totalFilteredPromedio = filteredStudents.reduce((acc, student) => {
    const promedio = parseFloat(student.promedio);
    return acc + (isNaN(promedio) ? 0 : promedio);
  }, 0);

  const promedioGeneral =
    totalFilteredStudents > 0
      ? (totalFilteredPromedio / totalFilteredStudents).toFixed(1)
      : 0;

  return (
    <div className="dashboard_div-doc" ref={contentRef}>
      <div className="dashboard_div_filtros">
        <Filtros_grafica
          
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          selectedScale={selectedScale}
          setSelectedScale={setSelectedScale}
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
        />
      </div>

      <div>
        <div className="dashboard_div-doc-header">
          <div>
            <h2>
              Grupo: <span className="doc-span">{selectedGroup}</span>
            </h2>
          </div>

           
        </div>

        <div className="BarChartComponent_pdf">
          <h4>Promedios por materia comparados por periodo:</h4>

          <BarChartGrafiasKPI
            students={students}
            selectedGroup={selectedGroup}
            error={error}
          />
        </div>

        <div className="box_prom_tables-doc">
          <div className="info-card">
            <h2 className="info-title">Consolidado de datos:</h2>

            <div className="info-list">
              <li className="info-item">
                Número de estudiantes:{" "}
                <span className="info-value">{totalFilteredStudents}</span>
              </li>

              <li className="info-item">
                Promedio general:{" "}
                <span className="info-value">{promedioGeneral}</span>
              </li>

              <li className="info-item">
                Estudiantes con promedio DI:{" "}
                <span className="info-value">{groupCounts.DI}</span>
              </li>

              <li className="info-item">
                Estudiantes con promedio BÁSICO:{" "}
                <span className="info-value">{groupCounts.BÁSICO}</span>
              </li>

              <li className="info-item">
                Estudiantes con promedio DA:{" "}
                <span className="info-value">{groupCounts.DA}</span>
              </li>

              <li className="info-item">
                Estudiantes con promedio DS:{" "}
                <span className="info-value">{groupCounts.DS}</span>
              </li>
            </div>
          </div>
        </div>
      </div>

      <div className="documentos-btn"></div>
    </div>
  );
};

export default GrafiasKpi;