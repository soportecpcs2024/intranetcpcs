import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const TareasContext = createContext();

export const TareasProvider = ({ children }) => {
  const [tareas, setTareas] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/tareas`;

  // Obtener todas las tareas
  const obtenerTareas = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setTareas(response.data);
    } catch (err) {
      console.error("Error al obtener tareas:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Crear una nueva tarea
  const crearTarea = async (nuevaTarea) => {
    try {
      const response = await axios.post(API_URL, nuevaTarea);
      setTareas((prev) => [...prev, response.data]);
    } catch (err) {
      console.error("Error al crear tarea:", err);
      setError(err);
    }
  };

  // Actualizar una tarea (por ejemplo estado)
  const actualizarTarea = async (id, datosActualizados) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, datosActualizados);
      setTareas((prev) =>
        prev.map((tarea) => (tarea._id === id ? response.data : tarea))
      );
    } catch (err) {
      console.error("Error al actualizar tarea:", err);
      setError(err);
    }
  };

  // Eliminar una tarea
  const eliminarTarea = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTareas((prev) => prev.filter((tarea) => tarea._id !== id));
    } catch (err) {
      console.error("Error al eliminar tarea:", err);
      setError(err);
    }
  };

  // Obtener estadísticas de tareas
  const obtenerEstadisticas = async () => {
    try {
      const response = await axios.get(`${API_URL}/estadisticas`);
      setEstadisticas(response.data);
    } catch (err) {
      console.error("Error al obtener estadísticas:", err);
      setError(err);
    }
  };

  useEffect(() => {
    obtenerTareas();
    obtenerEstadisticas();
  }, []);

  return (
    <TareasContext.Provider
      value={{
        tareas,
        loading,
        error,
        estadisticas,
        crearTarea,
        obtenerTareas,
        actualizarTarea,
        eliminarTarea,
        obtenerEstadisticas,
      }}
    >
      {children}
    </TareasContext.Provider>
  );
};
