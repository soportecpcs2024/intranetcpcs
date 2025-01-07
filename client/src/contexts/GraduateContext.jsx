import React, { createContext, useContext, useState } from "react";

// Crear el contexto
const GraduateContext = createContext();

// Proveedor del contexto
export const GraduateProvider = ({ children }) => {
  // Estado para manejar la URL base y otros datos relacionados con Graduate
  const [apiUrl, setApiUrl] = useState("http://localhost:3000/api");

  return (
    <GraduateContext.Provider value={{ apiUrl, setApiUrl }}>
      {children}
    </GraduateContext.Provider>
  );
};

// Hook personalizado para acceder al contexto
export const useGraduate = () => {
  return useContext(GraduateContext);
};
