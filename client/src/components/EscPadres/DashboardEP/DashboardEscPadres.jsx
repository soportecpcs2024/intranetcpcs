import { useState, useEffect } from "react";
import { useEscuelaPadres } from "../../../contexts/EscuelaPadresContext";
import BuscadorEstudiante from "../../EscPadres/BuecarEstudiante/BuscadorEstudiante";
import "./DashboardEscPadres.css";

const DashboardEscPadres = () => {
  const {
    escuelas,
    buscarEstudiantes,
    estudiantes,
    obtenerAsistencia,
    asistenciaActual,
    setAsistenciaActual,
    crearAsistencia,
    actualizarAsistencia,
  } = useEscuelaPadres();

  const [escuelaSeleccionada, setEscuelaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [formAsistencia, setFormAsistencia] = useState([]);
  const [entregaMaterial, setEntregaMaterial] = useState(false);
  const [tieneHermano, setTieneHermano] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModified, setIsModified] = useState(false); // 🟡 Nuevo estado

  const parseFechaLocal = (fechaStr) => {
    const [year, month, day] = fechaStr.split("T")[0].split("-");
    return new Date(Number(year), Number(month) - 1, Number(day));
  };

  const formatFechaColombia = (fechaStr) => {
    const date = parseFechaLocal(fechaStr);
    return new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  useEffect(() => {
    if (escuelas.length > 0 && !escuelaSeleccionada) {
      setEscuelaSeleccionada(escuelas[0]);
    }
  }, [escuelas, escuelaSeleccionada]);

  useEffect(() => {
    if (escuelaSeleccionada && estudianteSeleccionado) {
      obtenerAsistencia(escuelaSeleccionada._id, estudianteSeleccionado._id);
    }
  }, [escuelaSeleccionada, estudianteSeleccionado, obtenerAsistencia]);

  useEffect(() => {
    if (estudianteSeleccionado) {
      setTieneHermano(estudianteSeleccionado.hermanos || false);
    }
  }, [estudianteSeleccionado]);

  useEffect(() => {
    if (!escuelaSeleccionada) return;

    const fechasDisponibles = escuelaSeleccionada.fechas;

    const mismaFecha = (a, b) => {
      const fa = new Date(a);
      const fb = new Date(b);
      return (
        fa.getUTCDate() === fb.getUTCDate() &&
        fa.getUTCMonth() === fb.getUTCMonth() &&
        fa.getUTCFullYear() === fb.getUTCFullYear()
      );
    };

    if (asistenciaActual) {
      const asistenciasGuardadas = asistenciaActual?.asistencias ?? [];

      const formateadas = fechasDisponibles.map((fecha) => {
        const asistencia = asistenciasGuardadas.find((a) =>
          mismaFecha(a.fecha, fecha)
        );
        return {
          fecha,
          asistio: asistencia ? asistencia.asistio : false,
        };
      });

      // ✅ Solo sobrescribimos si no se han hecho cambios locales
      setFormAsistencia((prev) => {
        const algunaModificacion = prev.some((p) =>
          formateadas.find((f) => f.fecha === p.fecha && f.asistio !== p.asistio)
        );
        return isModified && prev.length > 0 ? prev : formateadas;
      });

      if (!isModified) {
        setEntregaMaterial(asistenciaActual.entregaMaterial || false);
      }
    } else {
      setFormAsistencia(
        fechasDisponibles.map((fecha) => ({
          fecha,
          asistio: false,
        }))
      );
      setEntregaMaterial(false);
    }
  }, [asistenciaActual, escuelaSeleccionada, estudianteSeleccionado, isModified]);

  const handleCheckChange = (fecha) => {
    setFormAsistencia((prev) =>
      prev.map((f) => (f.fecha === fecha ? { ...f, asistio: !f.asistio } : f))
    );
    setIsModified(true); // 🟢 Activamos bandera de cambio
  };

  const handleEntregaChange = (checked) => {
    setEntregaMaterial(checked);
    setIsModified(true); // 🟢 También marcamos como modificado
  };

  const handleGuardar = async () => {
    if (!estudianteSeleccionado || !escuelaSeleccionada) {
      alert("Selecciona un estudiante y una escuela.");
      return;
    }

    setLoading(true);

    const data = {
      estudianteId: estudianteSeleccionado._id,
      escuelaPadresId: escuelaSeleccionada._id,
      asistencias: formAsistencia,
      entregaMaterial,
      tieneHermano,
    };

    console.log("📤 Datos enviados:", data);

    try {
      let response;
      if (asistenciaActual?._id) {
        response = await actualizarAsistencia(asistenciaActual._id, data);
      } else {
        response = await crearAsistencia(data);
      }

      if (response && response.asistencia) {
        alert("✅ Asistencia guardada correctamente.");
        setEstudianteSeleccionado(null);
        setFormAsistencia([]);
        setEntregaMaterial(false);
        setTieneHermano(false);
        setBusqueda("");
        setAsistenciaActual(null);
        setIsModified(false);
      } else {
        alert("❌ No se pudo guardar la asistencia. Verifica los datos.");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("❌ Ocurrió un error al guardar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="escuelas-dashboard">
      <h2 className="titulo">Escuela de Padres CPCS 2025</h2>

      <h5>Escuelas disponibles 2025:</h5>
      <div className="escuelas-tabs">
        {escuelas.map((escuela) => (
          <button
            key={escuela._id}
            className={`tab-button ${
              escuelaSeleccionada?._id === escuela._id ? "active" : ""
            }`}
            onClick={() => {
              setEscuelaSeleccionada(escuela);
              setEstudianteSeleccionado(null);
              setFormAsistencia([]);
              setBusqueda("");
              setEntregaMaterial(false);
              setTieneHermano(false);
              setIsModified(false);
            }}
          >
            {escuela.nombre}
          </button>
        ))}
      </div>

      <BuscadorEstudiante
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        estudiantes={estudiantes}
        buscarEstudiantes={buscarEstudiantes}
        onSelectEstudiante={(est) => setEstudianteSeleccionado(est)}
      />

      {asistenciaActual === null && (
        <p style={{ marginBottom: "1rem", color: "#888", fontStyle: "italic" }}>
          Este estudiante aún no tiene asistencia registrada.
        </p>
      )}

      {estudianteSeleccionado && escuelaSeleccionada && (
        <div className="datos">
          <div>
            <p className="pp">
              Estudiante:{" "}
              <strong className="class-strong">
                {estudianteSeleccionado.nombre}
              </strong>
            </p>
            <p className="pp">
              Grupo:{" "}
              <strong className="class-strong">
                {estudianteSeleccionado.grupo}
              </strong>
            </p>
          </div>

          <div className="opciones-extra">
            <div>
              <input
                type="checkbox"
                checked={entregaMaterial}
                onChange={(e) => handleEntregaChange(e.target.checked)}
                className="pp"
              />
              <p className="pp">Entrega de material</p>
            </div>

            <div>
              <input
                type="checkbox"
                checked={tieneHermano}
                onChange={(e) => {
                  setTieneHermano(e.target.checked);
                  setIsModified(true);
                }}
              />
              <p className="pp">Tiene hermano</p>
            </div>
          </div>
        </div>
      )}

      {estudianteSeleccionado && escuelaSeleccionada && (
        <div className="tabla-container">
          <table className="tabla-asistencias">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Asistió</th>
              </tr>
            </thead>
            <tbody>
              {formAsistencia.map((f, i) => (
                <tr key={i}>
                  <td>{formatFechaColombia(f.fecha)}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={f.asistio}
                      onChange={() => handleCheckChange(f.fecha)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            className="btn-guardar"
            onClick={handleGuardar}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar Asistencia"}
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardEscPadres;
