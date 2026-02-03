import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";

const RecaudoContext = createContext();

export const RecaudoProvider = ({ children }) => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [clases, setClases] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [factura_id, setFactura_id] = useState({});
  const [almuerzo, setAlmuerzo] = useState([]);
  const [almuerzoFactura, setAlmuerzoFactura] = useState({});
  const [facturasConAsistencias, setFacturasConAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ NUEVO: facturas completas (endpoint nuevo)
  const [facturasCompletas, setFacturasCompletas] = useState([]);

  const apiBaseUrl = import.meta.env.VITE_BACKEND_URL;

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

  const fetchClases = useCallback(async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/recaudo/clases`);
      setClases(response.data);
    } catch (error) {
      console.error("Error fetching clases:", error);
    }
  }, [apiBaseUrl]);

  // ✅ EXISTENTE: facturas "clásicas"
  const fetchFacturas = useCallback(async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/recaudo/facturas`);
      setFacturas(response.data);
    } catch (error) {
      console.error("Error fetching facturas:", error);
    }
  }, [apiBaseUrl]);

  // ✅ NUEVO: facturas "completas"
  const fetchFacturasCompletas = useCallback(async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/recaudo/facturas-completas`);
      setFacturasCompletas(response.data);
    } catch (error) {
      console.error("Error fetching facturas completas:", error);
    }
  }, [apiBaseUrl]);

  const crearFactura = async (facturaData) => {
    try {
      const response = await axios.post(`${apiBaseUrl}/api/recaudo/facturas`, facturaData);

      // ✅ Mantienes compatibilidad: actualizas "facturas" como antes
      setFacturas((prevFacturas) => [...prevFacturas, response.data]);

      // ✅ Opcional: si quieres mantener el estado de completas actualizado sin esperar refresh:
      // await fetchFacturasCompletas();

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

      // ✅ Opcional: mantener completas sincronizadas
      // setFacturasCompletas((prev) => prev.filter((f) => f._id !== facturaId));

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

  // ✅ EXISTENTE: Obtener facturas con asistencias
  const fetchFacturasConAsistencias = useCallback(async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/asistenciasextra`);
      setFacturasConAsistencias(response.data);
    } catch (error) {
      console.error("Error al obtener facturas con asistencias:", error);
    }
  }, [apiBaseUrl]);

  // ✅ EXISTENTE: Actualizar asistencias por ID de factura
  const actualizarAsistenciasFactura = async (asistenciaId, data) => {
    try {
      const response = await axios.put(
        `${apiBaseUrl}/api/asistenciasextra/${asistenciaId}/asistencias`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error actualizando asistencias:", error);
    }
  };

  // Carga inicial
  useEffect(() => {
    Promise.allSettled([
      fetchEstudiantes(),
      fetchClases(),
      fetchFacturas(),
      fetchAlmuerzos(),
      fetchAlmuerzoFactura(),
      fetchFacturasConAsistencias(),
      // ✅ NUEVO: cargar completas (si lo quieres desde el inicio)
      fetchFacturasCompletas(),
    ]).finally(() => setLoading(false));
  }, [
    fetchEstudiantes,
    fetchClases,
    fetchFacturas,
    fetchAlmuerzos,
    fetchAlmuerzoFactura,
    fetchFacturasConAsistencias,
    fetchFacturasCompletas,
  ]);

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
        factura_id,
        facturasConAsistencias,
        fetchFacturasConAsistencias,
        actualizarAsistenciasFactura,

        // ✅ NUEVO: exponer completas
        facturasCompletas,
        fetchFacturasCompletas,
      }}
    >
      {children}
    </RecaudoContext.Provider>
  );
};

export const useRecaudo = () => useContext(RecaudoContext);
