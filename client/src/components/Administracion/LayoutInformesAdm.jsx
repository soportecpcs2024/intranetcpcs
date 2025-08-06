  import { useContext, useState, useMemo } from "react";
  import { TareasContext } from "../../contexts/TareaContext";
  import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    
  } from "recharts";
  import "./Layoutinformesadm.css";

  const mesesOpciones = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  const CUMPLIMIENTO_COLORS = {
    Eficiente: "#22c55e",
    Tardío: "#f87171",
    "sin asignación": "#8b94b3",
  };

  const LayoutInformesAdm = () => {
    const { tareas, loading, error } = useContext(TareasContext);
    const [mesFiltro, setMesFiltro] = useState("julio");
    const [tipoGrafica, setTipoGrafica] = useState("barra");

    

    

    // Filtrar tareas por mes
    const tareasFiltradasPorMes = useMemo(() => {
      if (!Array.isArray(tareas)) return [];
      return tareas.filter((tarea) => {
        if (!tarea?.fechaCreacion) return false;
        const fecha = new Date(tarea.fechaCreacion);
        if (isNaN(fecha.getTime())) return false;
        const nombreMes = fecha
          .toLocaleString("es-CO", { month: "long" })
          .toLowerCase();
        return nombreMes === mesFiltro.toLowerCase();
      });
    }, [tareas, mesFiltro]);

    const totalTareas = tareasFiltradasPorMes.length;

    // Conteos globales
    const conteoPorSeccion = useMemo(() => {
      if (!Array.isArray(tareasFiltradasPorMes)) return {};
      return tareasFiltradasPorMes.reduce((acc, tarea) => {
        const seccion = tarea.seccion || "Sin sección";
        acc[seccion] = (acc[seccion] || 0) + 1;
        return acc;
      }, {});
    }, [tareasFiltradasPorMes]);

    const conteoResponsables = useMemo(() => {
      if (!Array.isArray(tareasFiltradasPorMes)) return {};
      return tareasFiltradasPorMes.reduce((acc, tarea) => {
        const responsableGrupo = tarea.responsable || "sin asignación";
        acc[responsableGrupo] = (acc[responsableGrupo] || 0) + 1;
        return acc;
      }, {});
    }, [tareasFiltradasPorMes]);

    // Estadísticas detalladas sobre tareas filtradas
    const estadisticas = useMemo(() => {
      const resumen = {
        total: tareasFiltradasPorMes.length,
        cumplimiento: {},
        diferencias: [], // { tarea, diffDias }
        porResponsable: {},
        porSeccion: {},
        porComplejidad: {},
        porEstado: {},
      };

      tareasFiltradasPorMes.forEach((tarea) => {
        const tipoCumplimiento = tarea.cumplimiento || "sin asignación";
        resumen.cumplimiento[tipoCumplimiento] =
          (resumen.cumplimiento[tipoCumplimiento] || 0) + 1;

        // diferencia en días
        if (tarea.fechaTerminacion && tarea.fechaLimite) {
          const termino = new Date(tarea.fechaTerminacion);
          const limite = new Date(tarea.fechaLimite);
          const diffDias = (termino - limite) / (1000 * 60 * 60 * 24);
          resumen.diferencias.push({ tarea, diffDias });
        }

        // por responsable
        const responsable = tarea.responsable || "sin asignación";
        if (!resumen.porResponsable[responsable]) {
          resumen.porResponsable[responsable] = {
            total: 0,
            cumplimiento: {},
            diferencias: [],
          };
        }
        resumen.porResponsable[responsable].total += 1;
        resumen.porResponsable[responsable].cumplimiento[tipoCumplimiento] =
          (resumen.porResponsable[responsable].cumplimiento[tipoCumplimiento] || 0) +
          1;
        if (tarea.fechaTerminacion && tarea.fechaLimite) {
          const termino = new Date(tarea.fechaTerminacion);
          const limite = new Date(tarea.fechaLimite);
          const diffDias = (termino - limite) / (1000 * 60 * 60 * 24);
          resumen.porResponsable[responsable].diferencias.push(diffDias);
        }

        // por sección
        const seccion = tarea.seccion || "Sin sección";
        if (!resumen.porSeccion[seccion]) {
          resumen.porSeccion[seccion] = {
            total: 0,
            cumplimiento: {},
            diferencias: [],
          };
        }
        resumen.porSeccion[seccion].total += 1;
        resumen.porSeccion[seccion].cumplimiento[tipoCumplimiento] =
          (resumen.porSeccion[seccion].cumplimiento[tipoCumplimiento] || 0) + 1;
        if (tarea.fechaTerminacion && tarea.fechaLimite) {
          const termino = new Date(tarea.fechaTerminacion);
          const limite = new Date(tarea.fechaLimite);
          const diffDias = (termino - limite) / (1000 * 60 * 60 * 24);
          resumen.porSeccion[seccion].diferencias.push(diffDias);
        }

        // por nivel de complejidad
        const nivel = tarea.nivelComplejidad || "Sin nivel";
        if (!resumen.porComplejidad[nivel]) {
          resumen.porComplejidad[nivel] = {
            total: 0,
            cumplimiento: {},
          };
        }
        resumen.porComplejidad[nivel].total += 1;
        resumen.porComplejidad[nivel].cumplimiento[tipoCumplimiento] =
          (resumen.porComplejidad[nivel].cumplimiento[tipoCumplimiento] || 0) + 1;

        // por estado
        const estado = tarea.estado || "Desconocido";
        if (!resumen.porEstado[estado]) {
          resumen.porEstado[estado] = {
            total: 0,
            cumplimiento: {},
          };
        }
        resumen.porEstado[estado].total += 1;
        resumen.porEstado[estado].cumplimiento[tipoCumplimiento] =
          (resumen.porEstado[estado].cumplimiento[tipoCumplimiento] || 0) + 1;
      });

      const promedio = (arr) =>
        arr && arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
      const mediana = (arr) => {
        if (!arr || !arr.length) return 0;
        const sorted = [...arr].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0
          ? (sorted[mid - 1] + sorted[mid]) / 2
          : sorted[mid];
      };

      const diffsGlobales = resumen.diferencias.map((d) => d.diffDias);
      resumen.retrasoPromedio = promedio(diffsGlobales.filter((d) => d > 0));
      resumen.adelantoPromedio = promedio(diffsGlobales.filter((d) => d < 0));
      resumen.medianaDiferencia = mediana(diffsGlobales);

      resumen.topRetrasos = resumen.diferencias
        .filter((d) => d.diffDias > 0)
        .sort((a, b) => b.diffDias - a.diffDias)
        .slice(0, 5);

      return resumen;
    }, [tareasFiltradasPorMes]);

    // Datos para gráfico de cumplimiento
    const datosCumplimiento = useMemo(() => {
      const conteo = estadisticas.cumplimiento || {};
      return Object.entries(conteo).map(([name, value]) => ({
        name,
        value,
      }));
    }, [estadisticas]);

    // KPIs rápidos
    const porcentaje = (n) =>
      estadisticas.total ? ((n / estadisticas.total) * 100).toFixed(1) : "0.0";

    return (
      <div className="layout-informes">
        <div className="header">
          <div>
            <h2 style={{ margin: 0, color:"white" }}>
              Informe de tareas:{" "}
              {mesFiltro.charAt(0).toUpperCase() + mesFiltro.slice(1)}
            </h2>
            <div className="small-text">
              Total de tareas: {estadisticas.total}
            </div>
          </div>
          <div className="select-wrapper">
            <div>
              <label htmlFor="mes-select" style={{ marginRight: 6 }}>
                Mes:
              </label>
              <select
                id="mes-select"
                value={mesFiltro}
                onChange={(e) => setMesFiltro(e.target.value)}
                className="select-mes"
              >
                {mesesOpciones.map((mes) => (
                  <option key={mes} value={mes}>
                    {mes.charAt(0).toUpperCase() + mes.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading && <p>Cargando tareas...</p>}
        {error && <p>Error al cargar tareas: {error.message}</p>}

        {/* KPIs */}
        <div className="card">
          <h3>Resumen rápido / KPIs</h3>
          <div className="kpi-grid">
            <div className="metric">
              <div className="value">{estadisticas.total}</div>
              <div className="label">Tareas analizadas</div>
            </div>
            <div className="metric">
              <div className="value">
                {porcentaje(estadisticas.cumplimiento["Eficiente"] || 0)}%
              </div>
              <div className="label">% Eficiente</div>
            </div>
            <div className="metric">
              <div className="value">
                {porcentaje(estadisticas.cumplimiento["Tardío"] || 0)}%
              </div>
              <div className="label">% Tardío</div>
            </div>
            <div className="metric">
              <div className="value">
                {estadisticas.retrasoPromedio.toFixed(2)}
              </div>
              <div className="label">Retraso promedio (días)</div>
            </div>
            <div className="metric">
              <div className="value">
                {estadisticas.adelantoPromedio.toFixed(2)}
              </div>
              <div className="label">Adelanto promedio (días)</div>
            </div>
            <div className="metric">
              <div className="value">
                {estadisticas.medianaDiferencia.toFixed(2)}
              </div>
              <div className="label">Mediana diferencia</div>
            </div>
          </div>
        </div>

        {/* Cumplimiento */}
        <div className="card" style={{ marginTop: 16 }}>
          <h3>Cumplimiento</h3>
          <div className="select-wrapper">
            <label>
              <input
                type="radio"
                name="tipoGrafica"
                value="barra"
                checked={tipoGrafica === "barra"}
                onChange={() => setTipoGrafica("barra")}
              />{" "}
              Barra
            </label>
            <label>
              <input
                type="radio"
                name="tipoGrafica"
                value="pastel"
                checked={tipoGrafica === "pastel"}
                onChange={() => setTipoGrafica("pastel")}
              />{" "}
              Pastel
            </label>
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 300px", minWidth: 260 }}>
              <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer>
                  {tipoGrafica === "barra" ? (
                    <BarChart data={datosCumplimiento}>
                      <XAxis dataKey="name" stroke="#777" />
                      <YAxis allowDecimals={false} stroke="#777" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Cantidad">
                        {datosCumplimiento.map((entry) => (
                          <Cell
                            key={entry.name}
                            fill={CUMPLIMIENTO_COLORS[entry.name] || undefined}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  ) : (
                    <PieChart>
                      <Pie
                        data={datosCumplimiento}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={80}
                        label
                      >
                        {datosCumplimiento.map((entry) => (
                          <Cell
                            key={entry.name}
                            fill={CUMPLIMIENTO_COLORS[entry.name] || undefined}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
            <div style={{ flex: "0 1 220px", minWidth: 180 }}>
              <div className="detail-block">
                <h3 style={{ margin: "4px 0" }}>Detalle</h3>
                <ul className="list-compact">
                  {Object.entries(estadisticas.cumplimiento).map(
                    ([nombre, cantidad]) => {
                      const pct = estadisticas.total
                        ? ((cantidad / estadisticas.total) * 100).toFixed(1)
                        : "0.0";
                      return (
                        <li key={nombre}>
                          <span>{nombre}</span>
                          <span>
                            {cantidad} ({pct}%)
                          </span>
                        </li>
                      );
                    }
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Top retrasos */}
        <div className="card top-delays">
          <h3>Top tareas con mayor retraso</h3>
          {estadisticas.topRetrasos && estadisticas.topRetrasos.length > 0 ? (
            <ol>
              {estadisticas.topRetrasos.map(({ tarea, diffDias }, idx) => (
                <li key={idx}>
                  <div>
                    <div>
                      <strong>{tarea.titulo}</strong>{" "}
                      <span className="small-text">
                        ({tarea.seccion} - {tarea.responsable})
                      </span>
                    </div>
                    <div style={{ marginTop: 4 }}>
                      Retraso de{" "}
                      <span className="badge badge-late">
                        {diffDias.toFixed(2)} días
                      </span>{" "}
                      — Cumplimiento:{" "}
                      {tarea.cumplimiento === "Eficiente" ? (
                        <span className="badge badge-efficient">
                          {tarea.cumplimiento}
                        </span>
                      ) : (
                        <span className="badge badge-late">
                          {tarea.cumplimiento}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p>No hay tareas con retraso en el mes filtrado.</p>
          )}
        </div>

        {/* Conteos globales */}
        <div className="section-grid">
          <div className="card">
            <h3>Conteo por sección (global)</h3>
            {Object.entries(conteoPorSeccion)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([seccion, cantidad]) => (
                <div key={seccion} className="detail-block">
                  <div>
                    <strong>{seccion}</strong>
                  </div>
                  <div>{cantidad}</div>
                </div>
              ))}
          </div>
          <div className="card">
            <h3>Conteo por responsables (global)</h3>
            {Object.entries(conteoResponsables)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([responsable, cantidad]) => (
                <div key={responsable} className="detail-block">
                  <div>
                    <strong>{responsable}</strong>
                  </div>
                  <div>{cantidad}</div>
                </div>
              ))}
          </div>
        </div>

        {/* Desglose detallado */}
        <div className="card" style={{ marginTop: 16 }}>
          <h3>Desglose detallado</h3>
          <div className="resumen-detal">
            <div className="detail-block" style={{ flex: "1 1 300px" }}>
              <h2>Por responsable</h2>
              {Object.entries(estadisticas.porResponsable).map(
                ([responsable, data]) => {
                  const eficiente = data.cumplimiento["Eficiente"] || 0;
                  const tardio = data.cumplimiento["Tardío"] || 0;
                  const totalResp = data.total || 1;
                  const retrasoProm = data.diferencias
                    .filter((d) => d > 0)
                    .reduce((a, b) => a + b, 0) /
                    (data.diferencias.filter((d) => d > 0).length || 1);
                  return (
                    <div key={responsable} style={{ marginBottom: 8 }}>
                      <div>
                        <strong>{responsable}</strong> — total {data.total}
                      </div>
                      <div style={{ fontSize: 12 }}>
                        Eficiente: {((eficiente / totalResp) * 100).toFixed(1)}% (
                        {eficiente}) / Tardío: {((tardio / totalResp) * 100).toFixed(1)}% (
                        {tardio}) — Retraso promedio: {retrasoProm.toFixed(2)} días
                      </div>
                    </div>
                  );
                }
              )}
            </div>
            <div className="detail-block" style={{ flex: "1 1 300px" }}>
              <h2>Por sección</h2>
              {Object.entries(estadisticas.porSeccion).map(
                ([seccion, data]) => {
                  const eficiente = data.cumplimiento["Eficiente"] || 0;
                  const tardio = data.cumplimiento["Tardío"] || 0;
                  const totalSec = data.total || 1;
                  const mediana = (() => {
                    if (!data.diferencias || !data.diferencias.length) return 0;
                    const sorted = [...data.diferencias].sort((a, b) => a - b);
                    const mid = Math.floor(sorted.length / 2);
                    return sorted.length % 2 === 0
                      ? (sorted[mid - 1] + sorted[mid]) / 2
                      : sorted[mid];
                  })();
                  return (
                    <div key={seccion} style={{ marginBottom: 8 }}>
                      <div>
                        <strong>{seccion}</strong> — total {data.total}
                      </div>
                      <div style={{ fontSize: 12 }}>
                        Eficiente: {((eficiente / totalSec) * 100).toFixed(1)}% (
                        {eficiente}) / Tardío: {((tardio / totalSec) * 100).toFixed(1)}% (
                        {tardio}) — Mediana retraso: {mediana.toFixed(2)} días
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default LayoutInformesAdm;
