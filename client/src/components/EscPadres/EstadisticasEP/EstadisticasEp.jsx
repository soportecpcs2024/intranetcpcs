import { useEffect, useState } from "react";
import { useEscuelaPadres } from "../../../contexts/EscuelaPadresContext";
import { useLocation } from "react-router-dom"; // 👈 agregado
import * as XLSX from "xlsx";
import "./EstadisticasEp.css";

const EstadisticasEp = () => {
  const { asistenciasUnificadas } = useEscuelaPadres();
  const [dataUnificada, setDataUnificada] = useState([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState("Todos");
  const location = useLocation(); // 👈 detectar cambios de ruta

   

  // 📌 Función para cargar datos
  const cargarDatos = async () => {
    try {
      const data = await asistenciasUnificadas();
      setDataUnificada(data);
    } catch (error) {
      console.error("❌ Error cargando asistencias unificadas:", error);
    }
  };

  // 📌 Cargar cada vez que entres a esta ruta
  useEffect(() => {
    cargarDatos();
  }, [location.pathname]);

  // 📌 Formatear fecha exactamente como en la BD (UTC sin modificar día) con mes abreviado en español
  const formatFechaColombia = (fechaStr) => {
    if (!fechaStr) return "N/A";

    const [year, month, day] = fechaStr.split("T")[0].split("-");
    const meses = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];

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

  // 📌 Descargar Excel SOLO con los que tienen certificadoOtorgado = true
  const descargarExcel = () => {
    const filtrados = dataFiltrada.filter((item) => item.certificadoOtorgado);

    // Mapear la data para dejarla más limpia en Excel
    const dataExcel = filtrados.map((item) => ({
      Documento: item.estudiante?.documento || "N/A",
      Nombre: item.estudiante?.nombre || "N/A",
      Grupo: item.estudiante?.grupo || "N/A",
      Grado: item.estudiante?.grado || "N/A",
      Escuela: item.escuela?.nombre || "N/A",
      "Certificado Otorgado": item.certificadoOtorgado ? "Sí" : "No",
      "Total Asistencias": item.asistencias?.filter((a) => a.asistio).length || 0,
    }));

    // Crear hoja de Excel
    const ws = XLSX.utils.json_to_sheet(dataExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Certificados");

    // Descargar archivo
    XLSX.writeFile(wb, "EstudiantesCertificados.xlsx");
  };

  return (
    <div className="estadisticas-container">
      <h2>📊 Estadísticas Escuela de Padres</h2>
      <h4>Total estudiantes con registro: {dataFiltrada.length}</h4>

      {/* 📌 Botón para descargar Excel */}
      <button className="btn-excel" onClick={descargarExcel}>
        📥 Descargar Excel (Certificados)
      </button>

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
