import React, { createContext, useState, useEffect } from "react";

export const EvaluacionesContext = createContext();

export const EvaluacionesProvider = ({ children }) => {
  const [evaluaciones, setEvaluaciones] = useState([]);
   const API_BASE = import.meta.env.VITE_BACKEND_URL;

  const obtenerEvaluaciones = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/evaluacionRubricas`);
      const data = await res.json();
      setEvaluaciones(data);
    } catch (err) {
      console.error("Error al obtener evaluaciones:", err);
    }
  };

  useEffect(() => {
    obtenerEvaluaciones();
  }, []);

  return (
    <EvaluacionesContext.Provider
      value={{ evaluaciones, setEvaluaciones, obtenerEvaluaciones }}
    >
      {children}
    </EvaluacionesContext.Provider>
  );
};
