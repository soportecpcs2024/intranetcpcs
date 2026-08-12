import { createContext, useCallback, useContext, useState } from "react";
import axios from "axios";

const TomaAsistenciaContext = createContext();

export const TomaAsistenciaProvider = ({ children }) => {
  const [grupo, setGrupo] = useState("");
  const [estudiantes, setEstudiantes] = useState([]);
  const [mensajeAsistencia, setMensajeAsistencia] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiBaseUrl = import.meta.env.VITE_BACKEND_URL;

  const buscarGrupo = useCallback(
    async (grupoSeleccionado) => {
      const grupoLimpio = grupoSeleccionado?.trim().toUpperCase();

      if (!grupoLimpio) {
        setError("Debes seleccionar o escribir un grupo.");
        setEstudiantes([]);
        return null;
      }

      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `${apiBaseUrl}/asistenciaEstudiantes`,
          { params: { grupo: grupoLimpio } }
        );

        const listaPreparada = response.data.lista.map((estudiante) => ({
          ...estudiante,
          grupo: estudiante.grado || grupoLimpio,
          estado: "ASISTIO",
          observacion: "",
        }));

        setGrupo(grupoLimpio);
        setEstudiantes(listaPreparada);
        setMensajeAsistencia(response.data.message || "");

        return response.data;
      } catch (errorPeticion) {
        const mensaje =
          errorPeticion.response?.data?.message ||
          "No se pudo obtener la lista del grupo.";

        setEstudiantes([]);
        setMensajeAsistencia("");
        setError(mensaje);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiBaseUrl]
  );

  const actualizarEstudiante = (estudianteId, cambios) => {
    setEstudiantes((listaActual) =>
      listaActual.map((estudiante) =>
        estudiante._id === estudianteId
          ? { ...estudiante, ...cambios }
          : estudiante
      )
    );
  };

  const cambiarEstado = (estudianteId, estado) => {
    const estadosPermitidos = ["ASISTIO", "LLEGADA_TARDE", "FALTO"];
    if (!estadosPermitidos.includes(estado)) return;

    actualizarEstudiante(estudianteId, { estado });
  };

  const cambiarObservacion = (estudianteId, observacion) => {
    actualizarEstudiante(estudianteId, { observacion });
  };

  const marcarTodosAsistieron = () => {
    setEstudiantes((listaActual) =>
      listaActual.map((estudiante) => ({
        ...estudiante,
        estado: "ASISTIO",
        observacion: "",
      }))
    );
  };

  const guardarAsistencia = async () => {
    if (estudiantes.length === 0) {
      setError("No hay estudiantes para guardar.");
      return null;
    }

    setLoading(true);
    setError("");

    try {
      const listaParaGuardar = estudiantes.map((estudiante) => ({
        _id: estudiante._id,
        grupo: estudiante.grupo || grupo,
        estado: estudiante.estado || "ASISTIO",
        observacion: estudiante.observacion?.trim() || "",
      }));

      const response = await axios.post(
        `${apiBaseUrl}/asistenciaEstudiantes`,
        listaParaGuardar,
        { headers: { "Content-Type": "application/json" } }
      );

      setMensajeAsistencia("Asistencia tomada.");
      return response.data;
    } catch (errorPeticion) {
      const mensaje =
        errorPeticion.response?.data?.message ||
        "No se pudo guardar la asistencia.";

      setError(mensaje);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const limpiarAsistencia = () => {
    setGrupo("");
    setEstudiantes([]);
    setMensajeAsistencia("");
    setError("");
  };

  return (
    <TomaAsistenciaContext.Provider
      value={{
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
        limpiarAsistencia,
      }}
    >
      {children}
    </TomaAsistenciaContext.Provider>
  );
};

export const useTomaAsistencia = () => {
  const context = useContext(TomaAsistenciaContext);

  if (!context) {
    throw new Error(
      "useTomaAsistencia debe usarse dentro de TomaAsistenciaProvider."
    );
  }

  return context;
};
