import { createContext, useContext, useState } from "react";
import axios from "axios";

// Crear el contexto
const ActasDeGradoContext = createContext();

// Proveedor del contexto
export const ActasDeGradoProvider = ({ children }) => {
  const [apiUrl, setApiUrl] = useState(`${import.meta.env.VITE_BACKEND_URL}/api`);
  const [estudiantes, setEstudiantes] = useState([]);
  const [error, setError] = useState(null);

  // ✅ Crear estudiante
  const crearEstudiante = async (datosEstudiante) => {
    try {
      const response = await axios.post(`${apiUrl}/estudiantesActasgrado`, datosEstudiante);
      return response.data;
    } catch (err) {
      console.error("Error al crear estudiante:", err);
      setError(err.response?.data?.message || "Error al crear estudiante");
      return null;
    }
  };

  // ✅ Listar todos los estudiantes
  const listarEstudiantes = async () => {
    try {
      const response = await axios.get(`${apiUrl}/estudiantesActasgrado`);
      setEstudiantes(response.data);
      
    } catch (err) {
      console.error("Error al listar estudiantes:", err);
      setError(err.response?.data?.message || "Error al listar estudiantes");
    }
  };

  // ✅ Buscar estudiante por número de identificación
  const buscarPorIdentificacion = async (num_identificacion) => {
    try {
      const response = await axios.get(`${apiUrl}/estudiantesActasgrado/${num_identificacion}`);
      return response.data;
    } catch (err) {
      if (err.response?.status === 404) {
      // Estudiante no encontrado, no es un "error" grave
      return null;
    }
    console.error("Error al buscar estudiante:", err);
    setError("Ocurrió un error inesperado al buscar el estudiante.");
    return null;
  }
  };

  return (
    <ActasDeGradoContext.Provider
      value={{
        apiUrl,
        setApiUrl,
        crearEstudiante,
        listarEstudiantes,
        buscarPorIdentificacion,
        estudiantes,
        error,
      }}
    >
      {children}
    </ActasDeGradoContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useActasDeGrado = () => {
  const context = useContext(ActasDeGradoContext);
  if (!context) {
    throw new Error("useActasDeGrado debe usarse dentro de un ActasDeGradoProvider");
  }
  return context;
};
