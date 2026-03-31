import { useEffect, useMemo, useState, useCallback } from "react";
import { useCheckup } from "../../../hooks/useCheckup";
import "../stylePlan.css";

const AREAS = [
  { label: "Ciencias Naturales", value: "CIENCIAS_NATURALES" },
  { label: "Ciencias Sociales", value: "CIENCIAS_SOCIALES" },
  { label: "Matemáticas", value: "MATEMATICAS" },
  { label: "Lectura Crítica", value: "LECTURA_CRITICA" },
  { label: "Bilingüismo", value: "BILINGUISMO" },
];

const PERIODOS = [
  { label: "Periodo 1", value: 1 },
  { label: "Periodo 2", value: 2 },
  { label: "Periodo 3", value: 3 },
  { label: "Periodo 4", value: 4 },
];

const ChequeoSemanal = () => {
  const {
    obtenerPreguntas,
    upsertWeeklyCheckup,
    obtenerWeeklyCheckup,
    preguntas,
    grupos,
    listarGrupos,
    loading,
    error,
  } = useCheckup();

  const [area, setArea] = useState(AREAS[0].value);
  const [periodo, setPeriodo] = useState(PERIODOS[0].value);
  const [semana, setSemana] = useState(1);

  const [respuestas, setRespuestas] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const [grupo, setGrupo] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const total = preguntas?.length || 0;

  const respondidas = useMemo(() => {
    if (!preguntas?.length) return 0;
    let c = 0;
    for (const p of preguntas) {
      if (typeof respuestas[p._id] === "number") c += 1;
    }
    return c;
  }, [preguntas, respuestas]);

  const progreso = total ? Math.round((respondidas / total) * 100) : 0;

  const promedio = useMemo(() => {
    const valores = Object.values(respuestas).filter(
      (v) => typeof v === "number",
    );
    if (!valores.length) return "0.00";
    const avg = valores.reduce((a, b) => a + b, 0) / valores.length;
    return avg.toFixed(2);
  }, [respuestas]);

  // ✅ calcula el lunes de la semana seleccionada (semana 1 = lunes actual)
  const getWeekStartISO = useCallback((weekNumber) => {
    const now = new Date();
    const day = now.getDay(); // 0 domingo..6 sábado
    const diffToMonday = (day === 0 ? -6 : 1) - day;

    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const target = new Date(monday);
    target.setDate(monday.getDate() + (Number(weekNumber) - 1) * 7);
    return target.toISOString();
  }, []);

  const cambiarRespuesta = (preguntaId, score) => {
    setRespuestas((prev) => ({
      ...prev,
      [preguntaId]: score,
    }));
  };

  const resetForm = () => {
    setArea(AREAS[0].value);
    setPeriodo(PERIODOS[0].value);
    setSemana(1);
    setRespuestas({});
    setMensaje("");
    setObservaciones("");
  };

  // ✅ cargar preguntas + si ya existe chequeo guardado para esa area/periodo/semana, precargar respuestas
  useEffect(() => {
    const run = async () => {
      setMensaje("");
      setRespuestas({});
      setObservaciones("");
      listarGrupos();
      // eslint-disable-next-line react-hooks/exhaustive-deps

      await obtenerPreguntas({ area, periodo: Number(periodo) });

      if (!grupo) return; // si no hay grupo, no buscamos guardado

      try {
        const weekStart = getWeekStartISO(semana);

        const saved = await obtenerWeeklyCheckup({
          area,
          periodo: Number(periodo),
          weekStart,
          grupo,
        });

        if (saved?.answers?.length) {
          const map = {};
          for (const a of saved.answers) {
            map[a.questionId] = a.score;
          }
          setRespuestas(map);
          setObservaciones(saved?.observaciones || "");
          setMensaje("✅ Se cargó el chequeo guardado de esa semana.");
        }
      } catch {
        // si no existe guardado, no hacemos nada
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [area, periodo, semana, grupo, getWeekStartISO]);

  const guardarChequeo = async () => {
    try {
      setMensaje("");
      setGuardando(true);

      if (total === 0) {
        setMensaje("❌ Primero carga preguntas.");
        return;
      }

      if (respondidas !== total) {
        setMensaje("❌ Debes calificar todas las preguntas antes de guardar.");
        return;
      }

      const weekStart = getWeekStartISO(semana);

      const payload = {
        area,
        periodo: Number(periodo),
        weekStart,
        grupo, // ✅
        answers: Object.keys(respuestas).map((id) => ({
          questionId: id,
          score: Number(respuestas[id]),
        })),
        observaciones, // ✅ aquí estabas mandando ""
        evidencias: [],
      };

      await upsertWeeklyCheckup(payload);
      setMensaje("✅ Chequeo guardado correctamente.");
      resetForm(); // ✅ volver al estado inicial
    } catch (e) {
      setMensaje(
        e?.response?.data?.message || "❌ Error guardando el chequeo.",
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="cs-page">
      <div className="cs-shell">
        {/* Header */}
        <div className="cs-header">
          <div className="cs-header-left">
            <div className="cs-badge">Plan de Mejoramiento</div>

            <div className="cs-chequeo-estadistica">
              <h1 className="cs-title">Chequeo Semanal</h1>

              <div className="cs-progress-value">
                <div>
                  {respondidas}/{total} ({progreso}%)
                </div>
                <div style={{ fontWeight: 800, color: "#050505" }}>
                  Promedio: {promedio}
                </div>
              </div>
            </div>

            <p className="cs-subtitle">
              Responde las preguntas y guarda el chequeo para seguimiento y
              estadísticas.
            </p>
          </div>

          <div className="cs-header-right">
            <div className="cs-progress-card">
              <div className="cs-progress-top">
                <span className="cs-progress-label">Progreso</span>
                <span className="cs-progress-value">
                  {respondidas}/{total} ({progreso}%)
                </span>
              </div>

              <div className="cs-progress-bar">
                <div
                  className="cs-progress-fill"
                  style={{ width: `${progreso}%` }}
                />
              </div>

              <div className="cs-progress-hint">
                Completa todas las preguntas para un chequeo más preciso.
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="cs-filters">
          <div className="cs-field">
            <label className="cs-label">Área</label>
            <select
              className="cs-control"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            >
              {AREAS.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>

          <select
            className="cs-control"
            value={grupo}
            onChange={(e) => setGrupo(e.target.value)}
          >
            <option value="">Seleccionar grupo</option>

            {grupos.map((g) => (
              <option key={g.nombre} value={g.nombre}>
                {g.nombre}
              </option>
            ))}
          </select>

          <div className="cs-field">
            <label className="cs-label">Periodo</label>
            <select
              className="cs-control"
              value={periodo}
              onChange={(e) => setPeriodo(Number(e.target.value))}
            >
              {PERIODOS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className="cs-field">
            <label className="cs-label">Semana</label>
            <input
              className="cs-control"
              type="number"
              min={1}
              value={semana}
              onChange={(e) => setSemana(Number(e.target.value))}
            />
          </div>

         
        </div>

        {/* Alerts */}
        {(mensaje || error) && (
          <div
            className={`cs-alert ${error ? "cs-alert-error" : "cs-alert-ok"}`}
          >
            {mensaje || `❌ ${error?.message || "Error"}`}
          </div>
        )}

        {/* Contenido */}
        <div className="cs-content">
          {loading && (
            <div className="cs-skeleton">
              <div className="cs-skel-line" />
              <div className="cs-skel-line" />
              <div className="cs-skel-line" />
            </div>
          )}

          {!loading && (preguntas?.length ?? 0) === 0 && (
            <div className="cs-empty">
              <div className="cs-empty-icon">📝</div>
              <div className="cs-empty-title">No hay preguntas</div>
              <div className="cs-empty-text">
                Cambia el área, periodo o semana.
              </div>
            </div>
          )}

          <div className="cs-grid">
            {preguntas?.map((p, index) => {
              const val = respuestas[p._id];

              return (
                <div className="cs-card" key={p._id}>
                  <div className="cs-card-top">
                    <span className="cs-card-index">{index + 1}</span>
                    <div className="cs-card-question">
                      {p.pregunta || p.texto || "Pregunta sin texto"}
                    </div>
                  </div>

                  <div className="cs-actions">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        className={`cs-chip ${val === num ? "active score" : ""}`}
                        onClick={() => cambiarRespuesta(p._id, num)}
                      >
                        {num}
                      </button>
                    ))}

                    <span
                      className={`cs-status ${typeof val === "number" ? "done" : ""}`}
                    >
                      {typeof val === "number"
                        ? `Calificado: ${val}`
                        : "Pendiente"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer actions */}
        <div className="cs-footer">
          <div>
            <div className="cs-footer-left">
              <div className="cs-footer-note">
                Consejo: responde todo y guarda al final para registrar
                correctamente.
              </div>
            </div>

            <div className="cs-field" style={{ gridColumn: "1 / -1" }}>
              <label className="cs-label">Observaciones</label>
              <textarea
                className="cs-control"
                rows={3}
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Escribe observaciones de la semana..."
              />
            </div>
          </div>

          <div className="cs-footer-right">
            <button
              className="cs-btn cs-btn-primary"
              onClick={guardarChequeo}
              disabled={guardando || loading || total === 0}
              title={total === 0 ? "Primero carga preguntas" : ""}
            >
              {guardando ? "Guardando..." : "Guardar Chequeo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChequeoSemanal;
