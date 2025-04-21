import { useEffect, useState } from "react";
import { StudentsSection, StudentsSectionPromedioMaterias } from "../../../../api/DataApi";

import BarChartPromediosGruposPrimaria from "../basica_primaria/BarChartPromediosGruposPrimaria";
import PieChartComponentGruposPrimaria from "../basica_primaria/PieChartComponentGruposPrimaria";
import "../basica_primaria/basicaPrimaria.css";
import ListarMaterias from "../../ListarMaterias/ListarMaterias";

const PreEscolar = () => {
  const [dataPrimaria, setDataPrimaria] = useState([]);
  const [dataMaterias, setDataMaterias] = useState({})
  const [loading, setLoading] = useState(true);

  const Lideres = ["CASTRILLON VILLA ANA CATALINA"];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await StudentsSection("preescolar");
        setDataPrimaria(data);
      } catch (error) {
        console.error("Error al obtener las notas de básica primaria", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await StudentsSection("preescolar");
        setDataPrimaria(data);
      } catch (error) {
        console.error("Error al obtener las notas de básica primaria", error);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    const fetchDataMateria = async () => {
      try {
        const data = await StudentsSectionPromedioMaterias("preescolar");
        setDataMaterias(data);
      } catch (error) {
        console.error("Error al obtener las notas de básica primaria", error);
      }
    };

    fetchDataMateria();
  }, []);


  const capitalizar = (str) =>
    str
      .toLowerCase()
      .split(" ")
      .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(" ");

  return (
    <div>
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Cargando datos...</p>
        </div>
      ) : (
        <div>
          <div className="container-graficas-seccion-titulo">
            <div>
              <h3>Pre Escolar</h3>
            </div>

            <div>
              <p className="nombre-lider">{capitalizar(Lideres[0])}</p>
            </div>

            <div>
              <p>Estudiantes por sección: {dataPrimaria.length}</p>
            </div>
          </div>

          <div className="container-graficas-seccion">
            <div className="graficas-seccion-box">
              <BarChartPromediosGruposPrimaria data={dataPrimaria} />
            </div>
            <div className="graficas-seccion-box">
              <PieChartComponentGruposPrimaria data={dataPrimaria} />
            </div>
          </div>

          <div>
            <ListarMaterias  dataMaterias={dataMaterias} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PreEscolar;
