import React, { useState, useEffect } from "react";
import BarChartComponent from "./BarChartComponentGrupos";
import { Students } from "../api/DataApi";
import PieChartComponent from "./PieChartComponent";
import NewDatatable from "./NewDatatable";
import MetasGrupo from "./MetasGrupo";
import PromedioGrupos from "./PromedioGrupos";
import Filtros from "./Filtros";
import LoadingSpinner from "./LoadingSpinner";
import { updateMetasGrupo as updateMetasApi } from '../api/dataMetasGrupos'; // Importa la función API

const NewDashboard = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState("1. A");
  const [selectedPeriodo, setSelectedPeriodo] = useState("PERIODO 1"); // Por defecto selecciona "PERIODO 1"
  const [selectedScale, setSelectedScale] = useState("");
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const data = await Students();
        setStudents(data.slice(0, 50)); // Cargar los primeros 50 registros
        setInitialLoading(false); // Finaliza la carga inicial
        setTimeout(() => {
          setStudents(data); // Cargar el resto después de 5 segundos
          setLoading(false); // Finaliza la carga total
        }, 5000);
      } catch (error) {
        setError("Error fetching students");
        setLoading(false); // Cambia el estado de carga a falso en caso de error
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

    setFilteredStudents(filtered);
  }, [students, selectedGroup, selectedPeriodo, selectedScale]);

  const updateMetasGrupo = async (groupId, updatedMetas) => {
    try {
      const updatedMeta = await updateMetasApi(groupId, updatedMetas);
      setStudents((prevStudents) =>
        prevStudents.map((student) => {
          if (student.grupo === selectedGroup && student.periodo === selectedPeriodo) {
            return {
              ...student,
              metas: updatedMeta,
            };
          }
          return student;
        })
      );
    } catch (error) {
      console.error("Error updating metas:", error);
    }
  };

  if (initialLoading) {
    return <LoadingSpinner />; // Muestra el spinner durante la carga inicial
  }

  return (
    <div className="dashboard_div">
      <div className="dashboard_div_filtros">
        <Filtros
          selectedPeriodo={selectedPeriodo}
          setSelectedPeriodo={setSelectedPeriodo}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          selectedScale={selectedScale}
          setSelectedScale={setSelectedScale}
        />
        <PromedioGrupos
          className="promedio_grupos"
          students={filteredStudents}
          error={error}
        />
      </div>

      <div className="graficas_generales">
        <BarChartComponent students={filteredStudents} error={error} />
      </div>

      <div className="prom_tables">
        <div className="box_prom_tables">
          <NewDatatable students={filteredStudents} error={error} />
        </div>
        <div className="box_prom_tables">
          <PieChartComponent students={filteredStudents} error={error} />
        </div>
      </div>

      <div>
        <MetasGrupo
          selectedGroup={selectedGroup}
          selectedPeriodo={selectedPeriodo}
          updateMetasGrupo={updateMetasGrupo}
        />
      </div>
    </div>
  );
};

export default NewDashboard;
