import React, { useState, useEffect } from "react";
import { Students } from "../api/DataApi";
import PromedioGrupos from "./PromedioGrupos";
import LoadingSpinner from "./LoadingSpinner";
import FiltrosAreas from "./FiltrosAreas";
import DatatableBuscador from "./DataTableBuscador";
import FiltroIndividual from "./FiltroIndividual";
import InfoPersonalEstudiante from "./InfoPersonalEstudiante";

const DashboardIndividual = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState("1. A");
  const [selectedPeriodo, setSelectedPeriodo] = useState("PERIODO 1");
  const [selectedScale, setSelectedScale] = useState("");
  const [selectedArea, setSelectedArea] = useState("ciencias_naturales");
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null); // Añadir estado para el estudiante seleccionado
  const [lowGradesStudents, setLowGradesStudents] = useState([]); // Estado para estudiantes con notas menores a 3

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

    // Filtrar estudiantes con notas menores a 3
    const lowGrades = filtered.filter((student) => {
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
      for (let area of areas) {
        const value = parseFloat(student[area]);
        if (value !== 0 && value < 3) {
          return true;
        }
      }
      return false;
    });

    setLowGradesStudents(lowGrades);
  }, [students, selectedGroup, selectedPeriodo, selectedScale, selectedArea]);

  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="dashboard_div">
      <div className="dashboard_div_filtros">
        <FiltroIndividual
          selectedPeriodo={selectedPeriodo}
          setSelectedPeriodo={setSelectedPeriodo}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          selectedScale={selectedScale}
          setSelectedScale={setSelectedScale}
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
        />
        <PromedioGrupos
          className="promedio_grupos"
          students={filteredStudents}
          selectedArea={selectedArea}
          error={error}
        />
      </div>
      <div className="materiasperdidas">
        
     
           {/* Mostrar estudiantes con notas menores a 3 */}
           {lowGradesStudents.length > 0 && (
        <div className="low-grades-list">
          <h3>Estudiantes que perdieron materias :</h3>
          <ul>
            {lowGradesStudents.map((student, index) => (
              <li key={index}>
                {student.nombre}
              </li>
            ))}
          </ul>
        </div>
      )}
       </div>

      <div className="graficas-individuales-tabla-infopersonal">
        <div className="box-individual">
          <DatatableBuscador
            students={filteredStudents}
            selectedArea={selectedArea}
            error={error}
            onStudentSelect={setSelectedStudent} // Añadir función de selección de estudiante
          />
        </div>
        <div className="box-individual">
          <InfoPersonalEstudiante student={selectedStudent} />
        </div>
      </div>

 

      
    </div>
  );
};

export default DashboardIndividual;
