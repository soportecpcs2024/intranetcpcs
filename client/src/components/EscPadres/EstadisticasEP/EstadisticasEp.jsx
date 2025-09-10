import { useEffect, useState } from "react";
import { useEscuelaPadres } from "../../../contexts/EscuelaPadresContext";
import "./EstadisticasEp.css";

const EstadisticasEp = () => {
  const { asistenciasUnificadas } = useEscuelaPadres();
  const [dataUnificada, setDataUnificada] = useState([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState("Todos");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await asistenciasUnificadas();
        setDataUnificada(data);
      } catch (error) {
        console.error("❌ Error cargando asistencias unificadas:", error);
      }
    };

    cargarDatos();
  }, []);
 
// 📌 Formatear fecha exactamente como en la BD (UTC sin modificar día) con mes abreviado en español
const formatFechaColombia = (fechaStr) => {
  if (!fechaStr) return "N/A";

  // Ejemplo de fechaStr: "2025-09-02T00:00:00.000+00:00"
  const [year, month, day] = fechaStr.split("T")[0].split("-");

  // Meses abreviados en español
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  return `| ${day} de ${meses[parseInt(month, 10) - 1]} |`;
};


  // 📌 Extraer lista de grupos únicos
  const grupos = [
    "Todos",
    ...[...new Set(dataUnificada.map((item) => item.estudiante?.grupo || "N/A"))].sort(
      (a, b) => {
        if (a === "N/A") return 1;
        if (b === "N/A") return -1;
        return a.localeCompare(b, "es", { numeric: true });
      }
    ),
  ];

  // 📌 Filtrar por grupo
  const dataFiltrada =
    grupoSeleccionado === "Todos"
      ? dataUnificada
      : dataUnificada.filter(
          (item) => item.estudiante?.grupo === grupoSeleccionado
        );

  return (
    <div className="estadisticas-container">
      <h2>📊 Estadísticas Escuela de Padres</h2>
      <h4>Total estudiantes con registro: {dataFiltrada.length}</h4>

      {/* 📌 Selector de grupo */}
      <div className="filtro-grupo">
        <label htmlFor="grupo">Filtrar por grupo: </label>
        <select
          id="grupo"
          value={grupoSeleccionado}
          onChange={(e) => setGrupoSeleccionado(e.target.value)}
        >
          {grupos.map((grupo, i) => (
            <option key={i} value={grupo}>
              {grupo}
            </option>
          ))}
        </select>
      </div>

      {/* 📌 Tabla */}
      <table className="estadisticas-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Grupo</th>
            <th>Escuela</th>
            <th>Asistencias</th>
            <th>Certificado</th>
          </tr>
        </thead>
        <tbody>
          {dataFiltrada.map((item) => {
            const estudiante = item.estudiante || {};
            const escuela = item.escuela || {};

            return (
              <tr key={item.asistenciaId}>
                <td>{estudiante.nombre}</td>
                <td>{estudiante.grupo || "N/A"}</td>
                <td>{escuela.nombre || "N/A"}</td>
                <td>
                  <div className="asistencias-lista">
                    {item.asistencias?.map((a) => (
                      <label key={a._id} className="asistencia-label">
                        <input type="checkbox" checked={a.asistio} readOnly />
                        {formatFechaColombia(a.fecha)}
                      </label>
                    ))}
                  </div>
                </td>
                <td>{item.certificadoOtorgado ? "✅ Sí" : "❌ No"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EstadisticasEp;
