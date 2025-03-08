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

  // ✅ Cargar lista de estudiantes
  const fetchEstudiantes = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/recaudo/estudiantes`);
      setEstudiantes(response.data);
    } catch (error) {
      console.error('Error fetching estudiantes:', error);
    }
  };

  // ✅ Buscar estudiante por ID o nombre
  const fetchEstudianteById = async (nombre) => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/recaudo/estudiantes?nombre=${nombre}`);
      return response.data;
    } catch (error) {
      console.error('Error buscando estudiante:', error);
      return null;
    }
  };

  // ✅ Cargar lista de clases
  const fetchClases = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/recaudo/clases`);
      setClases(response.data);
    } catch (error) {
      console.error('Error fetching clases:', error);
    }
  };

  // ✅ Cargar lista de facturas
  const fetchFacturas = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/recaudo/facturas`);
      setFacturas(response.data);
    } catch (error) {
      console.error('Error fetching facturas:', error);
    }
  };

  // ✅ Crear nueva factura
  const crearFactura = async (facturaData) => {
    try {
      const response = await axios.post(`${apiBaseUrl}/api/recaudo/facturas`, facturaData);
      setFacturas((prevFacturas) => [...prevFacturas, response.data]);
    } catch (error) {
      console.error('Error creando factura:', error);
    }
  };

  const eliminarFactura = async (facturaId) => {
    const confirmacion = window.confirm("¿Seguro que deseas eliminar esta factura?");
    if (!confirmacion) return;
  
    // Eliminación Optimista: Removemos la factura antes de hacer la petición
    const facturasPrevias = [...facturas];
    setFacturas(facturas.filter((factura) => factura._id !== facturaId));
  
    try {
      await axios.delete(`${apiBaseUrl}/api/recaudo/facturas/${facturaId}`);
      alert("Factura eliminada correctamente");
    } catch (error) {
      console.error("Error eliminando factura:", error);
      alert("No se pudo eliminar la factura");
      setFacturas(facturasPrevias); // Restauramos las facturas en caso de error
    }
  };
  
  

  // ✅ Ejecutar carga de datos en el montaje del componente
  useEffect(() => {
    fetchEstudiantes();
    fetchClases();
    fetchFacturas();
  }, []);

  useEffect(() => {
    if (estudiantes.length > 0 && clases.length > 0 && facturas.length > 0) {
      setLoading(false);
    }
  }, [estudiantes, clases, facturas]);

  return (
    <RecaudoContext.Provider value={{
      estudiantes,
      clases,
      facturas,
      fetchEstudianteById,
      fetchClases,
      fetchFacturas,  // <-- Agregar esto aquí
      loading,
      crearFactura,
      eliminarFactura
    }}>
      {children}
    </RecaudoContext.Provider>
  );
  
};

// Hook que usa el contexto
export const useRecaudo = () => {
  return useContext(RecaudoContext);
};
