import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Students } from "../../../api/DataApi";
import LoadingSpinner from "../../../components/LoadingSpinner";
import FiltrosAreasDocumentos from "../../../components/FiltrosAreasDocumentos";
import BarChartComponentAreasPDF from "../../../components/BarChartComponentAreasPDF";
import PieChartComponentAreas from "../../../components/PieChartComponentAreas";
import html2canvas from "html2canvas";

const Documentos = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState("1. A");
  const [selectedPeriodo, setSelectedPeriodo] = useState("PERIODO 1");
  const [selectedScale, setSelectedScale] = useState("");
  const [selectedArea, setSelectedArea] = useState("ciencias_naturales");
  const [loading, setLoading] = useState(true);
  const [groupCounts, setGroupCounts] = useState({
    DI: 0,
    BÁSICO: 0,
    DA: 0,
    DS: 0,
  });
  const navigate = useNavigate();
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
    let filtered = students;

    if (selectedGroup) {
      filtered = filtered.filter(
        (student) => student.grupo.trim() === selectedGroup
      );
    }

    if (selectedPeriodo) {
      filtered = filtered.filter(
        (student) => student.periodo.trim() === selectedPeriodo
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

    const counts = { DI: 0, BÁSICO: 0, DA: 0, DS: 0 };
    filtered.forEach((student) => {
      const value = parseFloat(student[selectedArea]);
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
  }, [students, selectedGroup, selectedPeriodo, selectedScale, selectedArea]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const totalFilteredStudents = filteredStudents.length;
  const totalFilteredPromedio = filteredStudents.reduce(
    (acc, student) => acc + parseFloat(student.promedio),
    0
  );
  const promedioGeneral =
    totalFilteredStudents > 0
      ? (totalFilteredPromedio / totalFilteredStudents).toFixed(1)
      : 0;

  const handleSaveAsImage = () => {
    if (contentRef.current) {
      const originalScale = window.devicePixelRatio;
      window.devicePixelRatio = 2; // Aquí aumentas el pixel ratio

      html2canvas(contentRef.current).then((canvas) => {
        window.devicePixelRatio = originalScale; // Restablece el pixel ratio
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = "Informe de áreas.png";
        link.href = imgData;
        link.click();
      });
    }
  };

  return (
    <div className="dashboard_div-doc" ref={contentRef}>
      <div className="dashboard_div_filtros">
        <FiltrosAreasDocumentos
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
      <div>
        <div className="dashboard_div-doc-header">
          <div>
            <h2>
              Grupo : <span className="doc-span">{selectedGroup}</span>
            </h2>
          </div>
          <div>
            <h2>
              <span className="doc-span">{selectedPeriodo}</span>
            </h2>
          </div>
        </div>
        <div className="BarChartComponent_pdf">
          <h2 className="info-title">Promedios por materia:</h2>
          <BarChartComponentAreasPDF
            students={filteredStudents}
            selectedArea={selectedArea}
            selectedGroup={selectedGroup}
            error={error}
          />
        </div>

        <div className="prom_tables-container">
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
                  Estudiantes con promedio DI{" "}
                  <span className="info-value">{groupCounts.DI}</span>
                </li>
                <li className="info-item">
                  Estudiantes con promedio BÁSICO{" "}
                  <span className="info-value">{groupCounts.BÁSICO} </span>
                </li>
                <li className="info-item">
                  Estudiantes con promedio DA{" "}
                  <span className="info-value">{groupCounts.DA}</span>
                </li>
                <li className="info-item">
                  Estudiantes con promedio DS{" "}
                  <span className="info-value">{groupCounts.DS}</span>
                </li>
              </div>
            </div>
          </div>

          <div className="box_prom_tables-doc">
            <PieChartComponentAreas
              students={filteredStudents}
              selectedArea={selectedArea}
              error={error}
            />
          </div>
        </div>
      </div>
      <div className="documentos-btn">
        <button className="documentos_btn_btn" onClick={handleSaveAsImage}>
          Guardar como Imagen
        </button>
      </div>
    </div>
  );
};

export default Documentos;
