import React, { useState, useEffect } from "react";
import { Students } from "../../api/DataApi";
import PromedioGrupos from "../../components/PromedioGrupos";
import LoadingSpinner from "../../components/LoadingSpinner";
import FiltrosAreas from "../../components/FiltrosAreas";
import BarChartComponentNS from "./BarChartComponentNS";
import TotalEstudiantesNS from "./TotalEstudiantesNS";
import FiltrosNS from "./FiltrosNS";
import html2canvas from "html2canvas";
import "./dashboardNS.css";
import Logo from "/logo.png";

// Función para transformar los nombres de áreas
const getAreaName = (area) => {
  const areaNames = {
    ciencias_naturales: "Ciencias Naturales",
    fisica: "Física",
    quimica: "Química",
    ciencias_politicas_economicas: "Ciencias Políticas y Económicas",
    ciencias_sociales: "Ciencias Sociales",
    civica_y_constitucion: "Cívica y Constitución Política",
    educacion_artistica: "Educación artística",
    educacion_cristiana: "Educación Cristiana",
    educacion_etica: "Ética",
    educacion_fisica: "Educación Física",
    filosofia: "Filosofía",
    idioma_extranjero: "Idioma Extranjero",
    lengua_castellana: "Lengua Castellana",
    matematicas: "Matemáticas",
    tecnologia: "Tecnología",
  };
  return areaNames[area] || area; // Devuelve el nombre mapeado o el valor original si no está mapeado
};

const DashboardNivelSuperior = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState("1. A");
  const [selectedPeriodo, setSelectedPeriodo] = useState("PERIODO 1");
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

    setFilteredStudents(filtered);
  }, [students, selectedGroup, selectedPeriodo]);

  const handleSaveAsImage = () => {
    const dashboardElement = document.querySelector(".dashboard_div");
    html2canvas(dashboardElement).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "dashboard.png";
      link.click();
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const areas = [
    "ciencias_naturales",
    "fisica",
    "quimica",
    "ciencias_politicas_economicas",
    "ciencias_sociales",
    "civica_y_constitucion",
    "educacion_artistica",
    "educacion_cristiana",
    "educacion_etica",
    "educacion_fisica",
    "filosofia",
    "idioma_extranjero",
    "lengua_castellana",
    "matematicas",
    "tecnologia",
  ];

  return (
    <div className="dashboard_div">
      <div className="dashboard_div_filtros">
        <FiltrosNS
          selectedPeriodo={selectedPeriodo}
          setSelectedPeriodo={setSelectedPeriodo}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
        />
      </div>

      <div>
      <div className="header-llegadastarde ns-border">
        <div>
          <img className="llegadaTarde-logo" src={Logo} alt="Logo CPCS" />
        </div>
        <div>
           
          <TotalEstudiantesNS students={filteredStudents} selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} />
        </div>
        <div className="header-llegadastarde-text">
          <p>Carrera 83 No. 78-30 Medellín - Colombia</p>
          <p>PBX: 442 06 06</p>
          <p>https://colombosueco.com/</p>
           
        </div>
      </div>
        
        <div>
          <div className="ns-barchart-container">
            {areas.map((area) => (
              <BarChartComponentNS
                key={area}
                students={filteredStudents}
                selectedArea={area}
                error={error}
                selectedGroup={selectedGroup}
                setSelectedGroup={setSelectedGroup}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="documentos-btn ns-btn">
        <button className="documentos_btn_btn" onClick={handleSaveAsImage}>
          Guardar como Imagen
        </button>
      </div>
    </div>
  );
};

export default DashboardNivelSuperior;

