import { useMemo, useState } from "react";
import { useTomaAsistencia } from "../../contexts/TomaAsistenciaContext";
import "./TomaAsistenciaGrupo.css";

const ESTADOS = [
  { value: "ASISTIO", label: "Asistió" },
  { value: "LLEGADA_TARDE", label: "Llegada tarde" },
  { value: "FALTO", label: "Faltó" },
];

const TomaAsistenciaGrupo = () => {
  const [grupoBusqueda, setGrupoBusqueda] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  const {
    grupo,
    estudiantes,
    mensajeAsistencia,
    loading,
    error,
    buscarGrupo,
    cambiarEstado,
    cambiarObservacion,
    marcarTodosAsistieron,
    guardarAsistencia,
  } = useTomaAsistencia();

  const resumen = useMemo(
    () => ({
      total: estudiantes.length,
      asistieron: estudiantes.filter(({ estado }) => estado === "ASISTIO").length,
      tarde: estudiantes.filter(({ estado }) => estado === "LLEGADA_TARDE").length,
      faltaron: estudiantes.filter(({ estado }) => estado === "FALTO").length,
    }),
    [estudiantes]
  );

  const handleBuscarGrupo = async (event) => {
    event.preventDefault();
    setMensajeExito("");
    await buscarGrupo(grupoBusqueda);
  };

  const handleGuardar = async () => {
    const confirmado = window.confirm(
      `¿Confirmas la asistencia de ${resumen.total} estudiantes del grupo ${grupo}?`
    );

    if (!confirmado) return;

    setMensajeExito("");
    const resultado = await guardarAsistencia();

    if (resultado) {
      setMensajeExito(resultado.message || "Asistencia guardada correctamente.");
    }
  };

  const obtenerClaseEstado = (estado) =>
    `asistencia-estado asistencia-estado--${estado.toLowerCase()}`;

  const estudiantesOrdenados = useMemo(() => {
  return [...estudiantes].sort((a, b) => {
    const nombreA = a.nombre || a.NOMBRE || "";
    const nombreB = b.nombre || b.NOMBRE || "";

    return nombreA.localeCompare(nombreB, "es", {
      sensitivity: "base",
    });
  });
}, [estudiantes]);

  return (
    <main className="asistencia-pagina">
      <section className="asistencia-contenedor">
        <header className="asistencia-encabezado">
          <div>
            <p className="asistencia-etiqueta">CONTROL DIARIO</p>
            <h1>Toma de asistencia</h1>
            <p className="asistencia-subtitulo">
              Registra asistencias, llegadas tarde y ausencias del grupo.
            </p>
          </div>

          <time className="asistencia-fecha" dateTime={new Date().toISOString()}>
            {new Intl.DateTimeFormat("es-CO", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date())}
          </time>
        </header>

        <form className="asistencia-buscador" onSubmit={handleBuscarGrupo}>
          <div className="asistencia-campo asistencia-campo--grupo">
            <label htmlFor="grupo">Grupo</label>
            <div className="grupos">

              <input
                id="grupo"
                type="text"
                value={grupoBusqueda}
                placeholder="Ejemplo: SEXTO"
                autoComplete="off"
                onChange={(event) => setGrupoBusqueda(event.target.value)}
              />
              <button className="asistencia-boton asistencia-boton--primario" type="submit" disabled={loading}>
                {loading ? "Consultando..." : "Buscar grupo"}
              </button>
            </div>
          </div>

        </form>

        {error && (
          <div className="asistencia-alerta asistencia-alerta--error" role="alert">
            {error}
          </div>
        )}

        {mensajeExito && (
          <div className="asistencia-alerta asistencia-alerta--exito" role="status">
            {mensajeExito}
          </div>
        )}

        {estudiantes.length > 0 && (
          <>
            <section className="asistencia-panel" aria-label="Resumen de asistencia">
              <div className="asistencia-panel__titulo">
                <div>
                  <span>Grupo seleccionado</span>
                  <h2>{grupo}</h2>
                </div>

                <span className={`asistencia-registro ${mensajeAsistencia === "Asistencia tomada." ? "asistencia-registro--tomada" : ""}`}>
                  {mensajeAsistencia || "Asistencia no tomada."}
                </span>
              </div>

              <div className="asistencia-resumen">
                <article><span>Total</span><strong>{resumen.total}</strong></article>
                <article className="resumen--asistio"><span>Asistieron</span><strong>{resumen.asistieron}</strong></article>
                <article className="resumen--tarde"><span>Llegada tarde</span><strong>{resumen.tarde}</strong></article>
                <article className="resumen--falto"><span>Faltaron</span><strong>{resumen.faltaron}</strong></article>
              </div>
            </section>

            <div className="asistencia-barra">
              <p><strong>{resumen.total}</strong> estudiantes encontrados</p>
              <button className="asistencia-boton asistencia-boton--secundario" type="button" onClick={marcarTodosAsistieron} disabled={loading}>
                Marcar todos: asistió
              </button>
            </div>

            <div className="asistencia-tabla-contenedor">
              <table className="asistencia-tabla">
                <thead>
                  <tr>
                    <th scope="col">N.º</th>
                    <th scope="col">Estudiante</th>

                    <th scope="col">Estado</th>
                    <th scope="col">Observación</th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantesOrdenados.map((estudiante, indice) => (
                    <tr key={estudiante._id}>
                      <td data-label="N.º" className="asistencia-numero">
                        {indice + 1}
                      </td>

                      <td data-label="Estudiante">
                        <strong className="asistencia-nombre">
                          {estudiante.nombre || estudiante.NOMBRE || "Sin nombre"}
                        </strong>
                      </td>

                      <td data-label="Estado">
                        <select
                          className={obtenerClaseEstado(estudiante.estado)}
                          value={estudiante.estado}
                          aria-label={`Estado de ${estudiante.nombre || estudiante.NOMBRE
                            }`}
                          onChange={(event) =>
                            cambiarEstado(estudiante._id, event.target.value)
                          }
                        >
                          {ESTADOS.map((estado) => (
                            <option key={estado.value} value={estado.value}>
                              {estado.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td data-label="Observación">
                        <textarea
                          className="asistencia-observacion"
                          value={estudiante.observacion}
                          maxLength={500}
                          rows={2}
                          placeholder="Observación opcional"
                          aria-label={`Observación de ${estudiante.nombre || estudiante.NOMBRE
                            }`}
                          onChange={(event) =>
                            cambiarObservacion(estudiante._id, event.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

            <div className="asistencia-acciones">
              <div>
                <strong>Revisa la información antes de guardar</strong>
                <span>La asistencia se registrará con la fecha de hoy.</span>
              </div>


              <button className="btn-guardar-a asistencia-boton asistencia-boton--guardar" type="button" onClick={handleGuardar} disabled={loading}>
                {loading ? "Guardando..." : "Guardar asistencia"}
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default TomaAsistenciaGrupo;
