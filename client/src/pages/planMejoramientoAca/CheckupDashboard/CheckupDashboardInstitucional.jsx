import { useContext, useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { CheckupContext } from "../../../contexts/CheckupContext";
import "./CheckupDashboardInstitucional.css";

const AREAS = [
  { value: "", label: "Todas las áreas" },
  { value: "CIENCIAS_NATURALES", label: "Ciencias Naturales" },
  { value: "MATEMATICAS", label: "Matemáticas" },
  { value: "LENGUA_CASTELLANA", label: "Lengua Castellana" },
  { value: "SOCIALES", label: "Ciencias Sociales" },
  { value: "INGLES", label: "Inglés" },
 
];

const PERIODOS = [
  { value: "", label: "Todos los períodos" },
  { value: 1, label: "Periodo 1" },
  { value: 2, label: "Periodo 2" },
  { value: 3, label: "Periodo 3" },
  { value: 4, label: "Periodo 4" },
];

function formatDateLabel(value) {
  if (!value) return "";
  const d = new Date(value);
  return d.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
  });
}

function formatPercent(value) {
  return `${Number(value || 0).toFixed(1)}%`;
}

function formatScore(value) {
  return Number(value || 0).toFixed(2);
}

function buildTrafficData(traffic) {
  return [
    { name: "Bajo", value: Number(traffic?.lowPct || 0) },
    { name: "Medio", value: Number(traffic?.midPct || 0) },
    { name: "Alto", value: Number(traffic?.highPct || 0) },
  ];
}

function getStateByScore(score) {
  const n = Number(score || 0);
  if (n >= 4) {
    return {
      label: "Desempeño alto",
      text: "El comportamiento general del plan muestra una ejecución sólida y estable.",
    };
  }
  if (n >= 3) {
    return {
      label: "Desempeño medio",
      text: "Se observan avances, pero aún hay oportunidades importantes de mejora.",
    };
  }
  return {
    label: "Riesgo académico",
    text: "Se recomienda intervención pedagógica y seguimiento prioritario.",
  };
}

const CheckupDashboardInstitucional = () => {
  const {
    loading,
    error,
    grupos,
    listarGrupos,
    dashboardInstitucional,
    obtenerDashboardInstitucional,
  } = useContext(CheckupContext);


  const [area, setArea] = useState("");
  const [periodo, setPeriodo] = useState(1);
  const [grupo, setGrupo] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    listarGrupos?.();
  }, [listarGrupos]);

  useEffect(() => {
    obtenerDashboardInstitucional?.({
      area,
      periodo,
      grupo,
      from,
      to,
    });
  }, [area, periodo, grupo, from, to, obtenerDashboardInstitucional]);

  const resumen = dashboardInstitucional?.summary || {};
  const traffic = dashboardInstitucional?.traffic || {};
  const trend = dashboardInstitucional?.trend || [];
  const avgByQuestion = dashboardInstitucional?.avgByQuestion || [];
  const byGroup = dashboardInstitucional?.byGroup || [];

  const trafficData = useMemo(() => buildTrafficData(traffic), [traffic]);

  const trendData = useMemo(() => {
    return trend.map((item) => ({
      fecha: formatDateLabel(item._id),
      promedio: Number(item.avgTotal || 0).toFixed(2),
      registros: item.n || 0,
    }));
  }, [trend]);

  const criticalQuestions = useMemo(() => {
    return [...avgByQuestion]
      .sort((a, b) => Number(a.avgScore || 0) - Number(b.avgScore || 0))
      .slice(0, 5)
      .map((item) => ({
        ...item,
        promedio: Number(item.avgScore || 0),
      }));
  }, [avgByQuestion]);

  const groupChartData = useMemo(() => {
    return [...byGroup]
      .sort((a, b) => Number(b.avgTotal || 0) - Number(a.avgTotal || 0))
      .map((item) => ({
        grupo: item.grupo || "Sin grupo",
        promedio: Number(item.avgTotal || 0).toFixed(2),
        registros: item.n || 0,
      }));
  }, [byGroup]);

  const estado = useMemo(
    () => getStateByScore(resumen.avgTotal),
    [resumen.avgTotal],
  );

  const insights = useMemo(() => {
    const items = [];

    if (Number(resumen.avgTotal || 0) < 3) {
      items.push("El promedio institucional se encuentra en nivel de riesgo y requiere acompañamiento prioritario.");
    } else if (Number(resumen.avgTotal || 0) < 4) {
      items.push("El promedio institucional se encuentra en nivel medio; es recomendable fortalecer seguimiento y cierre de brechas.");
    } else {
      items.push("El promedio institucional refleja un comportamiento favorable del plan de mejoramiento.");
    }

    if (criticalQuestions.length > 0) {
      items.push(
        `La pregunta más crítica es la #${criticalQuestions[0].numero} con promedio ${formatScore(criticalQuestions[0].promedio)}.`
      );
    }

    if (groupChartData.length > 0) {
      const top = groupChartData[0];
      const low = groupChartData[groupChartData.length - 1];
      items.push(
        `El grupo con mejor resultado actual es ${top.grupo} (${top.promedio}), mientras que el de menor resultado es ${low.grupo} (${low.promedio}).`
      );
    }

    if (Number(traffic.lowPct || 0) >= 30) {
      items.push("El porcentaje de registros en nivel bajo es alto, lo cual sugiere revisar estrategias de intervención por área o grupo.");
    }

    return items;
  }, [resumen.avgTotal, criticalQuestions, groupChartData, traffic.lowPct]);

  return (
    <div className="cs-page">
      <div className="cs-shell">
        <div className="cs-header cs-dashboard-header">
          <div className="cs-card">
            <div className="cs-badge">Dashboard institucional</div>

            <div className="cs-chequeo-estadistica">
              <div>
                <h1 className="cs-title">
                  Plan de Mejoramiento Académico
                </h1>
                <p className="cs-subtitle">
                  Panel institucional para el análisis del desempeño, seguimiento
                  de tendencias, grupos críticos y oportunidades de mejora.
                </p>
              </div>
            </div>
          </div>

          <div className="cs-progress-card">
            <div className="cs-progress-top">
              <span className="cs-progress-label">Estado general</span>
              <span className="cs-progress-value">
                {formatScore(resumen.avgTotal)} / 5
              </span>
            </div>

            <div className="cs-progress-bar">
              <div
                className="cs-progress-fill"
                style={{
                  width: `${Math.min((Number(resumen.avgTotal || 0) / 5) * 100, 100)}%`,
                }}
              />
            </div>

            <div className="cs-progress-hint">
              <strong>{estado.label}:</strong> {estado.text}
            </div>
          </div>
        </div>

        <div className="cs-filters">
          <div className="cs-field">
            <label className="cs-label">Área</label>
            <select
              className="cs-control"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            >
              {AREAS.map((item) => (
                <option key={item.value || "all"} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="cs-field">
            <label className="cs-label">Período</label>
            <select
              className="cs-control"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
            >
              {PERIODOS.map((item) => (
                <option key={String(item.value)} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="cs-field">
            <label className="cs-label">Grupo</label>
            <select
              className="cs-control"
              value={grupo}
              onChange={(e) => setGrupo(e.target.value)}
            >
              <option value="">Todos</option>
              {grupos?.map((g, index) => {
                const value = g?.nombre || g?.grupo || g;
                return (
                  <option key={g?._id || index} value={value}>
                    {value}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="cs-field">
            <label className="cs-label">Desde</label>
            <input
              type="date"
              className="cs-control"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>

          <div className="cs-field">
            <label className="cs-label">Hasta</label>
            <input
              type="date"
              className="cs-control"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="cs-btn cs-btn-secondary"
            onClick={() => {
              setArea("");
              setPeriodo(1);
              setGrupo("");
              setFrom("");
              setTo("");
            }}
          >
            Limpiar filtros
          </button>
        </div>

        {error && (
          <div className="cs-alert cs-alert-error">
            {error?.response?.data?.message || "Error cargando estadísticas institucionales"}
          </div>
        )}

        {!loading && Number(resumen.n || 0) > 0 && (
          <div className="cs-alert cs-alert-ok">
            Se analizaron <strong>{resumen.n}</strong> registros. Promedio general institucional:{" "}
            <strong>{formatScore(resumen.avgTotal)}</strong>.
          </div>
        )}

        {loading ? (
          <div className="cs-skeleton">
            <div className="cs-skel-line" style={{ width: "40%" }} />
            <div className="cs-skel-line" style={{ width: "100%" }} />
            <div className="cs-skel-line" style={{ width: "85%" }} />
          </div>
        ) : Number(resumen.n || 0) === 0 ? (
          <div className="cs-empty">
            <div className="cs-empty-icon">📊</div>
            <div className="cs-empty-title">Sin información para mostrar</div>
            <div className="cs-empty-text">
              No se encontraron registros con los filtros seleccionados.
            </div>
          </div>
        ) : (
          <>
            <div className="cs-kpis">
              <div className="cs-kpi-card">
                <span className="cs-kpi-label">Promedio general</span>
                <strong className="cs-kpi-value">{formatScore(resumen.avgTotal)}</strong>
                <small className="cs-kpi-note">Nivel institucional consolidado</small>
              </div>

              <div className="cs-kpi-card">
                <span className="cs-kpi-label">% alto</span>
                <strong className="cs-kpi-value">{formatPercent(traffic.highPct)}</strong>
                <small className="cs-kpi-note">Registros con desempeño favorable</small>
              </div>

              <div className="cs-kpi-card">
                <span className="cs-kpi-label">% medio</span>
                <strong className="cs-kpi-value">{formatPercent(traffic.midPct)}</strong>
                <small className="cs-kpi-note">Registros en seguimiento</small>
              </div>

              <div className="cs-kpi-card">
                <span className="cs-kpi-label">% bajo</span>
                <strong className="cs-kpi-value">{formatPercent(traffic.lowPct)}</strong>
                <small className="cs-kpi-note">Registros con alerta</small>
              </div>

              <div className="cs-kpi-card">
                <span className="cs-kpi-label">Registros</span>
                <strong className="cs-kpi-value">{resumen.n || 0}</strong>
                <small className="cs-kpi-note">Base analizada para el informe</small>
              </div>
            </div>

            <div className="cs-dashboard-grid">
              <div className="cs-card">
                <h3 className="cs-section-title">Tendencia semanal</h3>
                <p className="cs-section-subtitle">
                  Comportamiento histórico del promedio institucional por semana.
                </p>
                <div className="cs-chart-wrap">
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="fecha" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="promedio"
                        name="Promedio"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="cs-card">
                <h3 className="cs-section-title">Semáforo institucional</h3>
                <p className="cs-section-subtitle">
                  Distribución porcentual del estado de desempeño.
                </p>
                <div className="cs-chart-wrap">
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={trafficData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label={({ name, value }) => `${name}: ${formatPercent(value)}`}
                      >
                        <Cell fill="#ef4444" />
                        <Cell fill="#f59e0b" />
                        <Cell fill="#22c55e" />
                      </Pie>
                      <Tooltip formatter={(value) => formatPercent(value)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="cs-card cs-card-full">
                <h3 className="cs-section-title">Comparativo por grupo</h3>
                <p className="cs-section-subtitle">
                  Visualización de grupos con mejor y menor resultado promedio.
                </p>
                <div className="cs-chart-wrap">
                  <ResponsiveContainer width="100%" height={340}>
                    <BarChart data={groupChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="grupo" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="promedio" name="Promedio" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="cs-card">
                <h3 className="cs-section-title">Preguntas críticas</h3>
                <p className="cs-section-subtitle">
                  Ítems con menor promedio para focalizar acciones de mejora.
                </p>

                <div className="cs-critical-list">
                  {criticalQuestions.map((item) => (
                    <div className="cs-critical-item" key={item._id}>
                      <div className="cs-critical-index">#{item.numero}</div>
                      <div className="cs-critical-body">
                        <div className="cs-critical-text">{item.texto}</div>
                        <div className="cs-critical-meta">
                          Promedio: <strong>{formatScore(item.promedio)}</strong> · Respuestas:{" "}
                          <strong>{item.n}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cs-card">
                <h3 className="cs-section-title">Insights automáticos</h3>
                <p className="cs-section-subtitle">
                  Lectura institucional rápida para apoyar la toma de decisiones.
                </p>

                <div className="cs-insights-list">
                  {insights.map((item, index) => (
                    <div className="cs-insight-item" key={index}>
                      <span className="cs-insight-dot" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="cs-card cs-card-full">
              <h3 className="cs-section-title">Detalle de preguntas evaluadas</h3>
              <p className="cs-section-subtitle">
                Consolidado por pregunta del plan de mejoramiento.
              </p>

              <div className="cs-table-wrap">
                <table className="cs-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Pregunta</th>
                      <th>Promedio</th>
                      <th>Respuestas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {avgByQuestion.map((item) => (
                      <tr key={item._id}>
                        <td>{item.numero}</td>
                        <td>{item.texto}</td>
                        <td>{formatScore(item.avgScore)}</td>
                        <td>{item.n}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckupDashboardInstitucional;