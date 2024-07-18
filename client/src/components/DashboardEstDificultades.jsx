import React, { useState, useEffect } from "react";
import { Students } from "../api/DataApi";
import LoadingSpinner from "./LoadingSpinner";
import Filtros from "./Filtros";
import PromedioGrupos from "./PromedioGrupos";
import Card from "./Card"; // Componente de card, ajusta según tu estructura

const DashboardEstDificultades = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedPeriodo, setSelectedPeriodo] = useState("");
  const [selectedScale, setSelectedScale] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const data = await Students(); // Ajusta según tu función para obtener estudiantes
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
      filtered = filtered.filter((student) => student.grupo.trim() === selectedGroup);
    }

    if (selectedPeriodo) {
      filtered = filtered.filter((student) => student.periodo.trim() === selectedPeriodo);
    }

    if (selectedScale) {
      filtered = filtered.filter((student) => {
        let group;
        if (student.promedio < 3) {
          group = "DI";
        } else if (student.promedio < 4) {
          group = "BÁSICO";
        } else if (student.promedio < 4.6) {
          group = "DA";
        } else {
          group = "DS";
        }
        return group === selectedScale;
      });
    }

    // Filtrar por promedio menor que 3
    filtered = filtered.filter((student) => student.promedio < 3);

    setFilteredStudents(filtered);
  }, [students, selectedGroup, selectedPeriodo, selectedScale]);

  if (loading) {
    return <LoadingSpinner />; // Muestra el spinner mientras se cargan los datos
  }

  return (
    <div >

      <div  >
        <div className="estdificultades-cards" >
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <Card key={student._id} student={student} />
            ))
          ) : (
            <p>No hay estudiantes con promedio menor a 3 que cumplan los filtros seleccionados.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardEstDificultades;
