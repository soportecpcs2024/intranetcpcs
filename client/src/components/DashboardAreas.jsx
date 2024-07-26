import React, { useState, useEffect } from "react";
import { Students } from "../api/DataApi";
import MetasGrupo from "./MetasGrupo";
import PromedioGrupos from "./PromedioGrupos";
import LoadingSpinner from "./LoadingSpinner";
import FiltrosAreas from "./FiltrosAreas";
import BarChartComponentAreas from "./BarChartComponentAreas";
import DatatableAreas from "./DataTableAreas";
import PieChartComponentAreas from "./PieChartComponentAreas";
import StudentModal from "./StudentModal"; // Importar el modal

const DashboardAreas = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedPeriodo, setSelectedPeriodo] = useState("PERIODO 1");
  const [selectedScale, setSelectedScale] = useState("");
  const [selectedArea, setSelectedArea] = useState("ciencias_naturales");
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

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
        (student) => student.periodo && student.periodo.trim() === selectedPeriodo
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

  const handleUpdateObservations = (studentId, area, newObservation) => {
    // Lógica para actualizar observaciones en el estado local y en la base de datos
  };

  const openModal = (student) => {
    setSelectedStudent(student);
    setModalIsOpen(true);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="dashboard_div">
      <div className="dashboard_div_filtros">
        <FiltrosAreas
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

      <div className="graficas_generales">
        <BarChartComponentAreas
          students={filteredStudents}
          selectedArea={selectedArea}
          error={error}
        />
      </div>

      <div className="prom_tables">
        <div className="box_prom_tables">
          <DatatableAreas
            students={filteredStudents}
            selectedArea={selectedArea}
            error={error}
            onStudentClick={openModal} // Agregar el manejador de clics en los estudiantes
          />
        </div>
        <div className="box_prom_tables">
          <PieChartComponentAreas
            students={filteredStudents}
            selectedArea={selectedArea}
            error={error}
          />
        </div>
      </div>

      {selectedStudent && (
        <StudentModal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          student={selectedStudent}
          selectedArea={selectedArea}
          updateObservations={handleUpdateObservations}
        />
      )}
    </div>
  );
};

export default DashboardAreas;
