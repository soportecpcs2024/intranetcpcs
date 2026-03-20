import { useEffect, useState } from "react";
import { useEscuelaPadres } from "../../../contexts/EscuelaPadresContext";
import { useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import "./EstadisticasEp.css";

const EstadisticasEp = () => {
  const { asistenciasUnificadas, estudiantes } = useEscuelaPadres();

  const [dataUnificada, setDataUnificada] = useState([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState("Todos");

  const location = useLocation();

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

  // 📌 Formatear fecha exactamente como en la BD (UTC sin modificar día)
  const formatFechaColombia = (fechaStr) => {
    if (!fechaStr) return "N/A";

    const [month, day] = fechaStr.split("T")[0].split("-");
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
 
  const gruposBase =
    estudiantes && estudiantes.length > 0
      ? estudiantes.map((item) => item.grupo || "N/A")
      : dataUnificada.map((item) => item.estudiante?.grupo || "N/A");

  const grupos = [
    "Todos",
    ...[...new Set(gruposBase)].sort((a, b) => {
      if (a === "N/A") return 1;
      if (b === "N/A") return -1;
      return a.localeCompare(b, "es", { numeric: true });
    }),
  ];

  // 📌 Filtrar por grupo en la tabla principal
  const dataFiltrada =
    grupoSeleccionado === "Todos"
      ? dataUnificada
      : dataUnificada.filter(
          (item) => item.estudiante?.grupo === grupoSeleccionado
        );

  // 📌 Estudiantes únicos que compraron escuela
  const estudiantesEscuelaUnicos = Object.values(
    dataUnificada.reduce((acc, item) => {
      const doc =
        item.estudiante?.documento ||
        item.estudiante?.num_identificacion ||
        item.estudiante?._id;

      if (doc) {
        acc[doc] = item.estudiante;
      }

      return acc;
    }, {})
  );

  // 📌 Total de estudiantes del colegio por grupo
  const todosEstudiantesPorGrupo =
    estudiantes && estudiantes.length > 0
      ? estudiantes.reduce((acc, item) => {
          const grupo = item.grupo || "N/A";
          acc[grupo] = (acc[grupo] || 0) + 1;
          return acc;
        }, {})
      : {};

  // 📌 Total de estudiantes que compraron escuela por grupo
  const compraronPorGrupo = estudiantesEscuelaUnicos.reduce((acc, item) => {
    const grupo = item.grupo || "N/A";
    acc[grupo] = (acc[grupo] || 0) + 1;
    return acc;
  }, {});

  // 📌 Resumen por grupo
  const resumenPorGrupo =
    estudiantes && estudiantes.length > 0
      ? Object.keys(todosEstudiantesPorGrupo)
          .map((grupo) => {
            const total = todosEstudiantesPorGrupo[grupo] || 0;
            const compraron = compraronPorGrupo[grupo] || 0;
            const pendientes = total - compraron;
            const porcentaje =
              total > 0 ? ((compraron / total) * 100).toFixed(1) : "0.0";

            return {
              grupo,
              total,
              compraron,
              pendientes,
              porcentaje,
            };
          })
          .sort((a, b) =>
            a.grupo.localeCompare(b.grupo, "es", { numeric: true })
          )
      : [];

  // 📌 Aplicar también el filtro al resumen
  const resumenFiltrado =
    grupoSeleccionado === "Todos"
      ? resumenPorGrupo
      : resumenPorGrupo.filter((item) => item.grupo === grupoSeleccionado);

  // 📌 Descargar Excel SOLO con los que tienen certificadoOtorgado = true
  const descargarExcel = () => {
    const filtrados = dataFiltrada.filter((item) => item.certificadoOtorgado);

    const dataExcel = filtrados.map((item) => ({
      Documento: item.estudiante?.documento || "N/A",
      Nombre: item.estudiante?.nombre || "N/A",
      Grupo: item.estudiante?.grupo || "N/A",
      Grado: item.estudiante?.grado || "N/A",
      Escuela: item.escuela?.nombre || "N/A",
      "Certificado Otorgado": item.certificadoOtorgado ? "Sí" : "No",
      "Total Asistencias":
        item.asistencias?.filter((a) => a.asistio).length || 0,
    }));

    const ws = XLSX.utils.json_to_sheet(dataExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Certificados");
    XLSX.writeFile(wb, "EstudiantesCertificados.xlsx");
  };

  return (
    <div className="estadisticas-container">
      <h1>Estadísticas Escuela de Padres</h1>
      <h4>Total estudiantes del colegio: {estudiantes?.length || 0}</h4>
      <h4>Total estudiantes con registro en escuela: {dataFiltrada.length}</h4>

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

      {/* 📌 Resumen por grupo */}
      {resumenFiltrado.length > 0 && (
        <div className="resumen-grupos">
          <h4>Resumen por grupo:</h4>
          <table className="estadisticas-table">
            <thead>
              <tr >
                <th className="color-head">Grupo</th>
                <th className="color-head">Total estudiantes</th>
                <th className="color-head">Compraron escuela</th>
                <th className="color-head">Pendientes</th>
                <th className="color-head">% Cobertura</th>
              </tr>
            </thead>
            <tbody>
              {resumenFiltrado.map((item) => (
                <tr key={item.grupo}>
                  <td>{item.grupo}</td>
                  <td>{item.total}</td>
                  <td>{item.compraron}</td>
                  <td>{item.pendientes}</td>
                  <td>{item.porcentaje}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 📌 Tabla principal */}
         <h4>Asistencias individual:</h4>
      <table className="estadisticas-table">
        <thead>
          <tr >
            <th className="color-head">Nombre</th>
            <th className="color-head col-grupo">Grupo</th>
            <th className="color-head">Escuela</th>
            <th className="color-head">Asistencias</th>
            <th className="color-head">Certificado</th>
          </tr>
        </thead>
        <tbody>
          {dataFiltrada.map((item) => {
            const estudiante = item.estudiante || {};
            const escuela = item.escuela || {};

            return (
              <tr key={item.asistenciaId}>
                <td>{estudiante.nombre || "N/A"}</td>
                <td className="col-grupo">{estudiante.grupo || "N/A"}</td>
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