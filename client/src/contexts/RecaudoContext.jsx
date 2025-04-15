import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";

const RecaudoContext = createContext();

export const RecaudoProvider = ({ children }) => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [clases, setClases] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [factura_id, setFactura_id] = useState({})
  const [almuerzo, setAlmuerzo] = useState([]);
  const [almuerzoFactura, setAlmuerzoFactura] = useState({});
  const [loading, setLoading] = useState(true);

  const apiBaseUrl = import.meta.env.VITE_BACKEND_URL;

  // Cargar lista de estudiantes
  const fetchEstudiantes = useCallback(async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/recaudo/estudiantes`);
      
      setEstudiantes(response.data);
    } catch (error) {
      console.error("Error fetching estudiantes:", error);
    }
  }, [apiBaseUrl]);
  

 

  const fetchEstudianteById = async (nombre) => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/recaudo/estudiantes?nombre=${nombre}`);
      return response.data;
    } catch (error) {
      console.error("Error buscando estudiante:", error);
      return null;
    }
  };

  // Cargar lista de clases
  const fetchClases = useCallback(async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/recaudo/clases`);
      setClases(response.data);
    } catch (error) {
      console.error("Error fetching clases:", error);
    }
  }, [apiBaseUrl]);

  // Cargar lista de facturas
  const fetchFacturas = useCallback(async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/recaudo/facturas`);
      setFacturas(response.data);
    } catch (error) {
      console.error("Error fetching facturas:", error);
    }
  }, [apiBaseUrl]);

  const crearFactura = async (facturaData) => {
    try {
      const response = await axios.post(`${apiBaseUrl}/api/recaudo/facturas`, facturaData);
      setFacturas((prevFacturas) => [...prevFacturas, response.data]);
    } catch (error) {
      console.error("Error creando factura:", error);
    }
  };

  const eliminarFactura = async (facturaId) => {
    const confirmacion = window.confirm("¿Seguro que deseas eliminar esta factura?");
    if (!confirmacion) return;

    const facturasPrevias = [...facturas];
    setFacturas(facturas.filter((factura) => factura._id !== facturaId));

    try {
      await axios.delete(`${apiBaseUrl}/api/recaudo/facturas/${facturaId}`);
      alert("Factura eliminada correctamente");
    } catch (error) {
      console.error("Error eliminando factura:", error);
      alert("No se pudo eliminar la factura");
      setFacturas(facturasPrevias);
    }
  };

  const crearAlmuerzo = async (almuerzoData) => {
    try {
      const response = await axios.post(`${apiBaseUrl}/api/recaudo/almuerzos`, almuerzoData);
      setAlmuerzo((prevAlmuerzo) => [...prevAlmuerzo, response.data]);
    } catch (error) {
      console.error("Error creando Almuerzo:", error);
    }
  };

  const fetchAlmuerzos = useCallback(async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/recaudo/almuerzos`);
      setAlmuerzo(response.data);
    } catch (error) {
      console.error("Error fetching almuerzos:", error);
    }
  }, [apiBaseUrl]);

  const fetchAlmuerzoFactura = useCallback(async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/recaudo/almuerzoFactura`);
      setAlmuerzoFactura(response.data);
     
    } catch (error) {
      console.error("Error fetching almuerzoFactura:", error);
    }
  }, [apiBaseUrl]);

  const fetchAlmuerzoFacturaId = useCallback(async (factura_id) => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/recaudo/almuerzoFactura?_id=${factura_id}`);
      setFactura_id(response.data);
     
    } catch (error) {
      console.error("Error fetching almuerzoFactura:", error);
    }
  }, [apiBaseUrl]);

  const crearAlmuerzoFactura = async (factura) => {
    try {
      const response = await axios.post(`${apiBaseUrl}/api/recaudo/almuerzoFactura`, factura, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error creando almuerzo factura:", error.response?.data || error);
    }
  };

  useEffect(() => {
    Promise.allSettled([fetchEstudiantes(), fetchClases(), fetchFacturas(), fetchAlmuerzos(), fetchAlmuerzoFactura()])
      .finally(() => setLoading(false));
  }, [fetchEstudiantes, fetchClases, fetchFacturas, fetchAlmuerzos, fetchAlmuerzoFactura]);

 
   
  return (
    <RecaudoContext.Provider
      value={{
        estudiantes,
        fetchEstudiantes,
        clases,
        facturas,
        fetchEstudianteById,
        fetchClases,
        fetchFacturas,
        loading,
        crearFactura,
        eliminarFactura,
        crearAlmuerzo,
        crearAlmuerzoFactura,
        fetchAlmuerzos,
        almuerzoFactura,
        almuerzo,
        fetchAlmuerzoFactura,
        fetchAlmuerzoFacturaId,
        factura_id
      }}
    >
      {children}
    </RecaudoContext.Provider>
  );
};

export const useRecaudo = () => useContext(RecaudoContext);
