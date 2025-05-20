import { useEffect, useState } from "react";
import {
  StudentsSection,
  StudentsSectionPromedioMaterias,
} from "../../../../api/DataApi";

import BarChartPromediosGruposPrimaria from "../basica_primaria/BarChartPromediosGruposPrimaria";
import PieChartComponentGruposPrimaria from "../basica_primaria/PieChartComponentGruposPrimaria";
import "../basica_primaria/basicaPrimaria.css";
import ListarMaterias from "../../ListarMaterias/ListarMaterias";
import "../../Coordinadores.css";

const MediaAcademica = () => {
  const [dataPrimaria, setDataPrimaria] = useState([]);
  const [dataMaterias, setDataMaterias] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedPeriodo, setSelectedPeriodo] = useState("PERIODO 1");

  const Lideres = ["GONZALEZ VILORIA ANA MARELVIS"];

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
      const data = await StudentsSection("media", selectedPeriodo);
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
      const data = await StudentsSectionPromedioMaterias("media", selectedPeriodo);
      if (data && Object.keys(data).length > 0) {
        setDataMaterias(data);
      } else {
        setDataMaterias(null); // No hay datos
      }
    } catch (error) {
      console.error("Error al obtener los promedios por materia", error);
      setDataMaterias(null); // Error: también tratar como sin datos
    }
  };

  fetchDataMateria();
}, [selectedPeriodo]);

  return (
    <div>
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Cargando datos...</p>
        </div>
      ) : (
        <div>
          {/* Botones de periodo */}
          <div className="periodos">
            <div>Periodo</div>
            <div className="periodo-buttons-container">
              {["PERIODO 1", "PERIODO 2", "PERIODO 3", "PERIODO 4"].map((periodo) => (
                <button
                  key={periodo}
                  className={`periodo-button ${selectedPeriodo === periodo ? "selected" : ""}`}
                  onClick={() => handlePeriodoClick(periodo)}
                >
                  {periodo.split(" ")[1]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3>Media Académica</h3>
          </div>
          <div>
            <p className="nombre-lider">{capitalizar(Lideres[0])}</p>
          </div>
          <div>
            <p>Estudiantes por sección: {dataPrimaria.length}</p>
          </div>

          <div className="seccion-metas-lideres">
            <div className="seccion-metas-box">
              <h3>Plan de mejoramiento académico</h3>

              <div className="card_metas">
                <h4 className="subtitulometas">Metas académicas:</h4>
                <div className="text-metas-final"></div>
                <h4 className="subtitulometas">
                  Estrategias a implementar para elevar el nivel académico:
                </h4>
                <div className="text-metas-final"></div>
              </div>

              <div>
                <h3>Plan de mejoramiento comportamental</h3>
                <div className="card_metas">
                  <h3 className="subtitulometas">
                    Estudiantes con dificultad Disciplinarias:
                  </h3>
                  <div className="text-metas-final"></div>

                  <h3 className="subtitulometas">
                    Estudiantes pendientes de procesos Disciplinarios:
                  </h3>
                  <div className="text-metas-final"></div>

                  <h3 className="subtitulometas">
                    Estudiantes con sanción por parte del comité:
                  </h3>
                  <div className="text-metas-final"></div>

                  <h3 className="subtitulometas">
                    Faltas que más se repiten en el grupo:
                  </h3>
                  <div className="text-metas-final"></div>

                  <h3 className="subtitulometas">Estrategias a trabajar</h3>
                  <div className="text-metas-final"></div>
                </div>
              </div>
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
    <p style={{ textAlign: "center", marginTop: "1rem", fontWeight: "bold", color: "#b00" }}>
      No hay datos de promedios por materia para {selectedPeriodo}.
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

export default MediaAcademica;
