import { useEffect, useMemo, useState } from "react";
import { useCheckup } from "../../hooks/useCheckup";
import "./ChequeoSemanal.css";

const ChequeoSemanal = () => {
  const { obtenerPreguntas, upsertWeeklyCheckup, preguntas, loading, error } =
    useCheckup();

  const [area, setArea] = useState("Sistemas");
  const [periodo, setPeriodo] = useState("2026-1");
  const [semana, setSemana] = useState(1);

  const [respuestas, setRespuestas] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const total = preguntas?.length || 0;

  const respondidas = useMemo(() => {
    if (!preguntas?.length) return 0;
    let c = 0;
    for (const p of preguntas) {
      if (typeof respuestas[p._id] === "boolean") c += 1;
    }
    return c;
  }, [preguntas, respuestas]);

  const progreso = total ? Math.round((respondidas / total) * 100) : 0;

  const cargarPreguntas = async () => {
    setMensaje("");
    await obtenerPreguntas({ area, periodo });
  };

  useEffect(() => {
    cargarPreguntas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cambiarRespuesta = (preguntaId, valor) => {
    setRespuestas((prev) => ({
      ...prev,
      [preguntaId]: valor,
    }));
  };

  const guardarChequeo = async () => {
    try {
      setMensaje("");
      setGuardando(true);

      const payload = {
        area,
        periodo,
        semana: Number(semana),
        respuestas: Object.keys(respuestas).map((id) => ({
          preguntaId: id,
          valor: respuestas[id],
        })),
      };

      await upsertWeeklyCheckup(payload);
      setMensaje("✅ Chequeo guardado correctamente.");
    } catch (e) {
      setMensaje("❌ Error guardando el chequeo. Revisa tu sesión o el servidor.");
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
            <h1 className="cs-title">Chequeo Semanal</h1>
            <p className="cs-subtitle">
              Responde las preguntas y guarda el chequeo para seguimiento y estadísticas.
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
              <option>Sistemas</option>
              <option>Matematicas</option>
              <option>Lenguaje</option>
              <option>Ingles</option>
            </select>
          </div>

          <div className="cs-field">
            <label className="cs-label">Periodo</label>
            <input
              className="cs-control"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              placeholder="Ej: 2026-1"
            />
          </div>

          <div className="cs-field">
            <label className="cs-label">Semana</label>
            <input
              className="cs-control"
              type="number"
              min={1}
              value={semana}
              onChange={(e) => setSemana(e.target.value)}
            />
          </div>

          <button
            className="cs-btn cs-btn-secondary"
            onClick={cargarPreguntas}
            disabled={loading || guardando}
          >
            {loading ? "Cargando..." : "Cargar preguntas"}
          </button>
        </div>

        {/* Alerts */}
        {(mensaje || error) && (
          <div className={`cs-alert ${error ? "cs-alert-error" : "cs-alert-ok"}`}>
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

          {!loading && preguntas?.length === 0 && (
            <div className="cs-empty">
              <div className="cs-empty-icon">📝</div>
              <div className="cs-empty-title">No hay preguntas</div>
              <div className="cs-empty-text">
                Cambia el área o periodo y vuelve a cargar.
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
                    <button
                      type="button"
                      className={`cs-chip ${val === true ? "active yes" : ""}`}
                      onClick={() => cambiarRespuesta(p._id, true)}
                    >
                      Sí
                    </button>

                    <button
                      type="button"
                      className={`cs-chip ${val === false ? "active no" : ""}`}
                      onClick={() => cambiarRespuesta(p._id, false)}
                    >
                      No
                    </button>

                    <span className={`cs-status ${typeof val === "boolean" ? "done" : ""}`}>
                      {typeof val === "boolean" ? "Respondida" : "Pendiente"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer actions */}
        <div className="cs-footer">
          <div className="cs-footer-left">
            <div className="cs-footer-note">
              Consejo: responde todo y guarda al final para registrar correctamente.
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
