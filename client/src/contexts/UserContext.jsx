import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const verTodosLosUsuarios = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios`);
      setUsuarios(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching usuarios:", err);
      setError(err);
      setLoading(false);
    }
  };

  // Cargar usuarios al inicializar el contexto
  useEffect(() => {
    verTodosLosUsuarios();
  }, []);

  return (
    <UserContext.Provider value={{ usuarios, loading, error, verTodosLosUsuarios }}>
      {children}
    </UserContext.Provider>
  );
};
