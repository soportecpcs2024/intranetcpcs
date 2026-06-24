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

  const getMonday = useCallback((date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diffToMonday = (day === 0 ? -6 : 1) - day;

    d.setDate(d.getDate() + diffToMonday);
    d.setHours(0, 0, 0, 0);

    return d;
  }, []);

  const getWeekStartISO = useCallback(
    (weekNumber) => {
      const today = new Date();
      const currentMonday = getMonday(today);

      const target = new Date(currentMonday);
      target.setDate(currentMonday.getDate() + (Number(weekNumber) - 1) * 7);
      target.setHours(0, 0, 0, 0);

      return target.toISOString();
    },
    [getMonday]
  );

  const weekStartPreview = useMemo(() => {
    const d = new Date(getWeekStartISO(semana));
    return d.toLocaleDateString("es-CO", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, [semana, getWeekStartISO]);

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
      (v) => typeof v === "number"
    );

    if (!valores.length) return "0.00";

    const avg = valores.reduce((a, b) => a + b, 0) / valores.length;

    return avg.toFixed(2);
  }, [respuestas]);

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
    setGrupo("");
    setRespuestas({});
    setMensaje("");
    setObservaciones("");
  };

  useEffect(() => {
    const run = async () => {
      setMensaje("");
      setRespuestas({});
      setObservaciones("");

      listarGrupos?.();

      await obtenerPreguntas({
        area,
        periodo: Number(periodo),
      });

      if (!grupo) return;

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
        // No existe registro guardado para esa combinación.
      }
    };

    run();
  }, [
    area,
    periodo,
    semana,
    grupo,
    getWeekStartISO,
    listarGrupos,
    obtenerPreguntas,
    obtenerWeeklyCheckup,
  ]);

  const guardarChequeo = async () => {
    try {
      setMensaje("");
      setGuardando(true);

      if (!grupo) {
        setMensaje("❌ Debes seleccionar un grupo.");
        return;
      }

      if (total === 0) {
        setMensaje("❌ Primero carga preguntas.");
        return;
      }

      if (respondidas !== total) {
        setMensaje("❌ Debes calificar todas las preguntas antes de guardar.");
        return;
      }

      const weekStart = getWeekStartISO(semana);

      const fechaSemana = new Date(weekStart);
      const hoy = new Date();

      hoy.setHours(23, 59, 59, 999);

      if (fechaSemana > hoy) {
        setMensaje("❌ No puedes guardar chequeos de semanas futuras.");
        return;
      }

      const payload = {
        area,
        periodo: Number(periodo),
        weekStart,
        grupo,
        answers: Object.keys(respuestas).map((id) => ({
          questionId: id,
          score: Number(respuestas[id]),
        })),
        observaciones,
        evidencias: [],
      };

      await upsertWeeklyCheckup(payload);

      setMensaje("✅ Chequeo guardado correctamente.");
      resetForm();
    } catch (e) {
      setMensaje(
        e?.response?.data?.message || "❌ Error guardando el chequeo."
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="cs-page">
      <div className="cs-shell">
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

          <div className="cs-field">
            <label className="cs-label">Grupo</label>
            <select
              className="cs-control"
              value={grupo}
              onChange={(e) => setGrupo(e.target.value)}
            >
              <option value="">Seleccionar grupo</option>

              {[...(grupos || [])]
                .sort((a, b) => Number(a.orden || 0) - Number(b.orden || 0))
                .map((g) => (
                  <option key={g.nombre} value={g.nombre}>
                    {g.nombre}
                  </option>
                ))}
            </select>
          </div>

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
              max={1}
              value={semana}
              onChange={(e) => {
                const value = Number(e.target.value);

                if (value < 1) {
                  setSemana(1);
                  return;
                }

                if (value > 1) {
                  setSemana(1);
                  setMensaje("⚠️ Solo puedes registrar la semana actual.");
                  return;
                }

                setSemana(value);
              }}
            />

            <small style={{ fontWeight: 600, color: "#475569" }}>
              Fecha que se guardará: {weekStartPreview}
            </small>
          </div>
        </div>

        {(mensaje || error) && (
          <div
            className={`cs-alert ${error ? "cs-alert-error" : "cs-alert-ok"}`}
          >
            {mensaje || `❌ ${error?.message || "Error"}`}
          </div>
        )}

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
                Cambia el área, periodo o grupo.
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
                        className={`cs-chip ${
                          val === num ? "active score" : ""
                        }`}
                        onClick={() => cambiarRespuesta(p._id, num)}
                      >
                        {num}
                      </button>
                    ))}

                    <span
                      className={`cs-status ${
                        typeof val === "number" ? "done" : ""
                      }`}
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