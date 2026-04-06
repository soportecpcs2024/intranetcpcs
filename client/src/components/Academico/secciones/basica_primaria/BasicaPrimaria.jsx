import { useEffect, useState } from "react";
import {
  StudentsSection,
  StudentsSectionPromedioMaterias,
  VerPlanMejoramiento,
  ActualizarPlanMejoramiento,
} from "../../../../api/DataApi";

import BarChartPromediosGruposPrimaria from "../basica_primaria/BarChartPromediosGruposPrimaria";
import PieChartComponentGruposPrimaria from "../basica_primaria/PieChartComponentGruposPrimaria";
import "../basica_primaria/basicaPrimaria.css";
import ListarMaterias from "../../ListarMaterias/ListarMaterias";
import "../../Coordinadores.css";

const BasicaPrimaria = () => {
  const [dataPrimaria, setDataPrimaria] = useState([]);
  const [dataMaterias, setDataMaterias] = useState({});
  const [planMejora, setPlanMejora] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriodo, setSelectedPeriodo] = useState("PRIMER PERIODO");
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState({});

  const Lideres = ["LAURA MARCELA PERDOMO FRANCO"];

  const capitalizar = (str) =>
    str
      .toLowerCase()
      .split(" ")
      .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(" ");

  const handlePeriodoClick = (periodo) => {
    setSelectedPeriodo(periodo);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await StudentsSection("primaria", selectedPeriodo);
        setDataPrimaria(data);
      } catch (error) {
        console.error("Error al obtener las notas de media", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriodo]);

  useEffect(() => {
    const fetchDataMateria = async () => {
      try {
        const data = await StudentsSectionPromedioMaterias(
          "primaria",
          selectedPeriodo,
        );
        setDataMaterias(data && Object.keys(data).length > 0 ? data : null);
      } catch (error) {
        console.error("Error al obtener los promedios por materia", error);
        setDataMaterias(null);
      }
    };

    fetchDataMateria();
  }, [selectedPeriodo]);

  useEffect(() => {
    const fetchDataPlanMejora = async () => {
      try {
        const response = await VerPlanMejoramiento("primaria", selectedPeriodo);
        const dataArray = response.data || [];
        const filtro = dataArray.find(
          (item) =>
            item.seccion === "primaria" && item.periodo === selectedPeriodo,
        );
        if (filtro) {
          setPlanMejora(filtro);
          setEditedPlan(filtro); // Inicializamos el estado editable
        } else {
          setPlanMejora(null);
        }
      } catch (error) {
        console.error("Error al obtener el plan de mejoramiento", error);
        setPlanMejora(null);
      }
    };

    fetchDataPlanMejora();
  }, [selectedPeriodo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPlan((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardarCambios = async () => {
    try {
      await ActualizarPlanMejoramiento(planMejora._id, editedPlan);
      setPlanMejora(editedPlan);
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar el plan de mejoramiento", error);
    }
  };

  const mapaPeriodos = {
    "PRIMER PERIODO": "1",
    "SEGUNDO PERIODO": "2",
    "TERCER PERIODO": "3",
    "CUARTO PERIODO": "4",
  };
  const nombreMateriasPerdidasArray = [
    "ciencias_naturales",
    
    "ciencias_sociales",
    "civica_y_constitucion",
    "educacion_artistica",
    "educacion_cristiana",
    "educacion_etica",
    "educacion_fisica",
    
    
    "idioma_extranjero",
    "lengua_castellana",
    "matematicas",
    
    "tecnologia",
  ];

  const resultado = dataPrimaria
    .map((item) => {
      const nombreMateriasPerdidas = nombreMateriasPerdidasArray
        .filter((materia) => item[materia] !== undefined && item[materia] < 3)
        .map((materia) => ({
          materia,
          valor: item[materia],
        }));

      return {
        nombre: item.nombre,
        grupo: item.grupo,
        nombreMateriasPerdidas,
      };
    })
    .filter((item) => item.nombreMateriasPerdidas.length > 0);

  return (
    <div>
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Cargando datos...</p>
        </div>
      ) : (
        <div>
          <div className="periodos">
            <div>Periodo</div>
            <div className="periodo-buttons-container">
              {[
                "PRIMER PERIODO",
                "SEGUNDO PERIODO",
                "TERCER PERIODO",
                "CUARTO PERIODO",
              ].map((periodo) => (
                <button
                  key={periodo}
                  className={`periodo-button ${selectedPeriodo === periodo ? "selected" : ""}`}
                  onClick={() => handlePeriodoClick(periodo)}
                >
                  {mapaPeriodos[periodo]}
                </button>
              ))}
            </div>
          </div>

          <h3>Básica Primaria</h3>
          <p className="nombre-lider">{capitalizar(Lideres[0])}</p>
          <p className="num_estudiantes_seccion">
            Estudiantes por sección: {dataPrimaria.length}
          </p>

           <h5>Estudiantes que perdieron materias:</h5>
          {resultado.length > 0 ? (
            <table className="tabla-perdidas">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Grupo</th>
                  <th>Materias perdidas</th>
                </tr>
              </thead>
              <tbody>
                {resultado.map((estudiante, index) => (
                  <tr key={index}>
                    <td>{estudiante.nombre}</td>
                    <td>{estudiante.grupo}</td>
                    <td>
                      {estudiante.nombreMateriasPerdidas.map((m, i) => (
                        <span key={i} className="chip-materia">
                          {m.materia}: {m.valor}{" / "}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay datos</p>
          )}

          <div className="seccion-metas-lideres">
            <div className="seccion-metas-box">
              <h3>Plan de mejoramiento académico</h3>

              {planMejora ? (
                <div className="card_metas">
                  {isEditing ? (
                    <>
                      <h4 className="subtitulometas">Metas académicas:</h4>
                      <textarea
                        name="metasAcademicas"
                        value={editedPlan.metasAcademicas}
                        onChange={handleInputChange}
                      />

                      <h4 className="subtitulometas">
                        Estrategias a implementar:
                      </h4>
                      <textarea
                        name="estrategiasElevarNivel"
                        value={editedPlan.estrategiasElevarNivel}
                        onChange={handleInputChange}
                      />
                    </>
                  ) : (
                    <>
                      <h4 className="subtitulometas">Metas académicas:</h4>
                      <p className="text-metas-final">
                        {planMejora.metasAcademicas}
                      </p>
                      <h4 className="subtitulometas">
                        Estrategias a implementar:
                      </h4>
                      <p className="text-metas-final">
                        {planMejora.estrategiasElevarNivel}
                      </p>
                    </>
                  )}

                  <h3>Plan de mejoramiento comportamental</h3>

                  {[
                    "estudiantesDificultadDisciplinarias",
                    "estudiantesPendientesDisciplinarios",
                    "estudiantesSancionComite",
                    "faltasRepetidasGrupo",
                    "estrategiasTrabajar",
                  ].map((campo, index) => (
                    <div key={index}>
                      <h4 className="subtitulometas">
                        {campo.replace(/([A-Z])/g, " $1")}
                      </h4>
                      {isEditing ? (
                        <textarea
                          name={campo}
                          value={editedPlan[campo]}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p className="text-metas-final">{planMejora[campo]}</p>
                      )}
                    </div>
                  ))}

                  <div style={{ marginTop: "1rem" }}>
                    {isEditing ? (
                      <button
                        className="boton-guardar"
                        onClick={handleGuardarCambios}
                      >
                        Guardar cambios
                      </button>
                    ) : (
                      <button
                        className="boton-editar"
                        onClick={() => setIsEditing(true)}
                      >
                        Editar plan
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <p>No hay plan de mejoramiento disponible.</p>
              )}
            </div>

            <div className="seccion-metas-box">
              <div className="container-graficas-seccion-titulo"></div>
              <div className="container-graficas-seccion">
                <div className="graficas-seccion-box">
                  <BarChartPromediosGruposPrimaria data={dataPrimaria} />
                </div>
                <div className="graficas-seccion-box">
                  <PieChartComponentGruposPrimaria data={dataPrimaria} />
                </div>
              </div>

              <div>
                {dataMaterias ? (
                  <ListarMaterias dataMaterias={dataMaterias} />
                ) : (
                  <p
                    style={{
                      textAlign: "center",
                      marginTop: "1rem",
                      fontWeight: "bold",
                      color: "#b00",
                    }}
                  >
                    No hay datos de promedios por materia para {selectedPeriodo}
                    .
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicaPrimaria;
