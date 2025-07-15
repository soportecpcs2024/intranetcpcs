import { createContext, useContext, useState } from "react";
import axios from "axios";

// Crear el contexto
const GraduateContext = createContext();

// Proveedor del contexto
export const GraduateProvider = ({ children }) => {
  const [apiUrl, setApiUrl] = useState("http://localhost:3000/api");
  const [estudiantes, setEstudiantes] = useState([]);
  const [error, setError] = useState(null);

  // Crear estudiante
  const crearEstudiante = async (datosEstudiante) => {
    try {
      const response = await axios.post(`${apiUrl}/actasdegrado`, datosEstudiante);
      return response.data;
    } catch (err) {
      console.error("Error al crear estudiante:", err);
      setError(err.response?.data?.message || "Error al crear estudiante");
    }
  };

  // Listar estudiantes
  const listarEstudiantes = async () => {
    try {
      const response = await axios.get(`${apiUrl}/actasdegrado`);
      setEstudiantes(response.data);
    } catch (err) {
      console.error("Error al listar estudiantes:", err);
      setError(err.response?.data?.message || "Error al listar estudiantes");
    }
  };

  // Buscar estudiante por identificación
  const buscarEstudiantePorIdentificacion = async (num_identificacion) => {
    try {
      const response = await axios.get(`${apiUrl}/actasdegrado/${num_identificacion}`);
      return response.data;
    } catch (err) {
      console.error("Error al buscar estudiante:", err);
      setError(err.response?.data?.message || "Estudiante no encontrado");
    }
  };

  return (
    <GraduateContext.Provider
      value={{
        apiUrl,
        setApiUrl,
        crearEstudiante,
        listarEstudiantes,
        buscarEstudiantePorIdentificacion,
        estudiantes,
        error,
      }}
    >
      {children}
    </GraduateContext.Provider>
  );
};

// Hook personalizado para acceder al contexto
export const useGraduate = () => useContext(GraduateContext);
