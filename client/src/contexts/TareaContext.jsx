import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const TareasContext = createContext();

export const TareasProvider = ({ children }) => {
  // TAREAS
  const [tareas, setTareas] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);

  // MANTENIMIENTOS
  const [mantenimientos, setMantenimientos] = useState([]);

  // Compartido
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const TAREAS_API = `${import.meta.env.VITE_BACKEND_URL}/api/tareas`;
  const MANT_API = `${import.meta.env.VITE_BACKEND_URL}/api/mantenimiento`;

  // --------------------------------
  // 🔹 Funciones para TAREAS
  // --------------------------------

  const obtenerTareas = async () => {
    try {
      setLoading(true);
      const response = await axios.get(TAREAS_API);
      setTareas(response.data);
    } catch (err) {
      console.error("Error al obtener tareas:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const crearTarea = async (nuevaTarea) => {
    try {
      const response = await axios.post(TAREAS_API, nuevaTarea);
      setTareas((prev) => [...prev, response.data]);
    } catch (err) {
      console.error("Error al crear tarea:", err);
      setError(err);
    }
  };

  const actualizarTarea = async (id, datosActualizados) => {
    try {
      const response = await axios.patch(`${TAREAS_API}/${id}`, datosActualizados);
      setTareas((prev) =>
        prev.map((tarea) => (tarea._id === id ? response.data : tarea))
      );
    } catch (err) {
      console.error("Error al actualizar tarea:", err);
      setError(err);
    }
  };

  const eliminarTarea = async (id) => {
    try {
      await axios.delete(`${TAREAS_API}/${id}`);
      setTareas((prev) => prev.filter((tarea) => tarea._id !== id));
    } catch (err) {
      console.error("Error al eliminar tarea:", err);
      setError(err);
    }
  };

  // --------------------------------
  // 🔹 Funciones para MANTENIMIENTOS
  // --------------------------------

  const obtenerMantenimientos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(MANT_API);
      setMantenimientos(response.data);
    } catch (err) {
      console.error("Error al obtener mantenimientos:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const crearMantenimiento = async (nuevo) => {
    try {
      const response = await axios.post(MANT_API, nuevo);
      setMantenimientos((prev) => [...prev, response.data]);
    } catch (err) {
      console.error("Error al crear mantenimiento:", err);
      setError(err);
    }
  };

  const actualizarMantenimiento = async (id, datosActualizados) => {
    try {
      const response = await axios.put(`${MANT_API}/${id}`, datosActualizados);
      setMantenimientos((prev) =>
        prev.map((item) => (item._id === id ? response.data : item))
      );
    } catch (err) {
      console.error("Error al actualizar mantenimiento:", err);
      setError(err);
    }
  };

  const eliminarMantenimiento = async (id) => {
    try {
      await axios.delete(`${MANT_API}/${id}`);
      setMantenimientos((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error al eliminar mantenimiento:", err);
      setError(err);
    }
  };

  useEffect(() => {
    obtenerTareas();
    obtenerMantenimientos();
  }, []);

  return (
    <TareasContext.Provider
      value={{
        // Tareas
        tareas,
        crearTarea,
        actualizarTarea,
        eliminarTarea,
        obtenerTareas,

        // Mantenimientos
        mantenimientos,
        crearMantenimiento,
        actualizarMantenimiento,
        eliminarMantenimiento,
        obtenerMantenimientos,

        // Común
        loading,
        error,
        estadisticas,
      }}
    >
      {children}
    </TareasContext.Provider>
  );
};
