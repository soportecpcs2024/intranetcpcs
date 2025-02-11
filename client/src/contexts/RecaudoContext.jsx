// RecaudoContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const RecaudoContext = createContext();

// RecaudoProvider para envolver el árbol de componentes
export const RecaudoProvider = ({ children }) => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [clases, setClases] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiBaseUrl = import.meta.env.VITE_BACKEND_URL;

  // Funciones de obtención de datos
  const fetchEstudiantes = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/recaudo/estudiantes`);
      setEstudiantes(response.data);
    } catch (error) {
      console.error('Error fetching estudiantes:', error);
    }
  };

  const fetchEstudianteById = async (documentoIdentidad) => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/recaudo/estudiantes/${documentoIdentidad}`);
      return response.data; // Devuelve el estudiante encontrado
    } catch (error) {
      console.error('Error buscando estudiante:', error);
      return null;
    }
  };
  

  const fetchClases = async () => {
    try {
      console.log('Cargando clases...'); // Para depuración
      const response = await axios.get(`${apiBaseUrl}/api/recaudo/clases`);
      console.log('Clases obtenidas:', response.data); // Verifica qué devuelve la API
      setClases(response.data);
    } catch (error) {
      console.error('Error fetching clases:', error);
    }
  };
  

  const fetchFacturas = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/recaudo/facturas`);
      setFacturas(response.data);
    } catch (error) {
      console.error('Error fetching facturas:', error);
    }
  };

  // RecaudoContext.jsx

const crearFactura = async (facturaData) => {
  try {
    const response = await axios.post(`${apiBaseUrl}/api/recaudo/facturas`, facturaData);
    setFacturas((prevFacturas) => [...prevFacturas, response.data]); // Añadir la nueva factura al estado
    console.log('Factura creada:', response.data);
  } catch (error) {
    console.error('Error creando factura:', error);
  }
};


  useEffect(() => {
    fetchEstudiantes();
    fetchClases();
    fetchFacturas();
    fetchEstudianteById();
   
  }, []);

  useEffect(() => {
    if (estudiantes.length > 0 && clases.length > 0 && facturas.length > 0) {
      setLoading(false);
    }
  }, [estudiantes, clases, facturas]);

  return (
    <RecaudoContext.Provider value={{ estudiantes, clases, facturas, fetchEstudianteById, fetchClases, loading, crearFactura }}>
      {children}
    </RecaudoContext.Provider>
  );
};

// Hook que usa el contexto
export const useRecaudo = () => {
  return useContext(RecaudoContext);
};
