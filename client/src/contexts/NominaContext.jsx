// src/context/NominaContext.jsx
import { createContext, useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";

const NominaContext = createContext();

export const NominaProvider = ({ children }) => {
  const apiBaseUrl = import.meta.env.VITE_BACKEND_URL;

  // loading real para acciones (subir/buscar/eliminar)
  const [loading, setLoading] = useState(false);

  // estados
  const [uploadResult, setUploadResult] = useState(null);

  const [registrosCedula, setRegistrosCedula] = useState([]); // TODOS por cédula
  const [registroCedulaFecha, setRegistroCedulaFecha] = useState(null); // UNO por cédula+fecha

  // ✅ NUEVO: registros por fechaColilla (todos los empleados en esa fecha)
  const [registrosFecha, setRegistrosFecha] = useState([]); // TODOS por fecha
  const [deleteResultFecha, setDeleteResultFecha] = useState(null); // respuesta del delete por fecha

  const [error, setError] = useState(null);

  // ✅ Limpiar todo lo relacionado con nómina (para botón "Limpiar")
  const clearNomina = useCallback(() => {
    setError(null);
    setUploadResult(null);

    setRegistrosCedula([]);
    setRegistroCedulaFecha(null);

    setRegistrosFecha([]);
    setDeleteResultFecha(null);
  }, []);

  // ✅ Subir Excel Nómina
  const uploadNomina = async (file) => {
    setError(null);
    setUploadResult(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file); // debe llamarse "file" (multer)

      const response = await axios.post(`${apiBaseUrl}/api/nomina/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadResult(response.data);
      return response.data;
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Error subiendo nómina";
      setError(msg);
      console.error("Error uploadNomina:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Traer TODOS los registros por cédula (sin importar la fecha)
  const fetchNominaByCedula = useCallback(
    async (cedula) => {
      setError(null);
      setRegistrosCedula([]);
      setLoading(true);

      try {
        const response = await axios.get(
          `${apiBaseUrl}/api/nomina/by-cedula/${encodeURIComponent(cedula)}`
        );

        // si backend devuelve {cedula,totalRegistros,registros}
        const payload = response.data;
        const registros = Array.isArray(payload) ? payload : payload?.registros || [];

        setRegistrosCedula(registros);
        return payload;
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Error buscando nómina por cédula";
        setError(msg);
        console.error("Error fetchNominaByCedula:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiBaseUrl]
  );

  // ✅ Traer UNA colilla por cédula + fecha (fecha=YYYY-MM-DD)
  const fetchNominaByCedulaFecha = useCallback(
    async (cedula, fechaYYYYMMDD) => {
      setError(null);
      setRegistroCedulaFecha(null);
      setLoading(true);

      try {
        const response = await axios.get(
          `${apiBaseUrl}/api/nomina/by-cedula-fecha/${encodeURIComponent(cedula)}`,
          { params: { fecha: fechaYYYYMMDD } }
        );

        setRegistroCedulaFecha(response.data);
        return response.data;
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Error buscando nómina por cédula y fecha";
        setError(msg);
        console.error("Error fetchNominaByCedulaFecha:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiBaseUrl]
  );

  // ✅ NUEVO: Traer TODOS los registros por fecha (fechaColilla)
  // Requiere ruta: GET /api/nomina/by-fecha?fecha=YYYY-MM-DD
  const fetchNominaByFecha = useCallback(
    async (fechaYYYYMMDD) => {
      setError(null);
      setRegistrosFecha([]);
      setDeleteResultFecha(null);
      setLoading(true);

      try {
        const response = await axios.get(`${apiBaseUrl}/api/nomina/by-fecha`, {
          params: { fecha: fechaYYYYMMDD },
        });

        // si backend devuelve {fecha,totalRegistros,registros}
        const payload = response.data;
        const registros = Array.isArray(payload) ? payload : payload?.registros || [];

        setRegistrosFecha(registros);
        return payload;
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Error buscando nómina por fecha";
        setError(msg);
        console.error("Error fetchNominaByFecha:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiBaseUrl]
  );

  // ✅ NUEVO: Eliminar TODOS los registros por fecha (fechaColilla)
  // Requiere ruta: DELETE /api/nomina/by-fecha?fecha=YYYY-MM-DD
  const deleteNominaByFecha = useCallback(
    async (fechaYYYYMMDD) => {
      setError(null);
      setDeleteResultFecha(null);
      setLoading(true);

      try {
        const response = await axios.delete(`${apiBaseUrl}/api/nomina/by-fecha`, {
          params: { fecha: fechaYYYYMMDD },
        });

        

        setDeleteResultFecha(response.data);

        // refrescar estados locales si ya tenías info cargada:
        setRegistrosFecha((prev) => prev); // no obliga, pero lo dejo claro
        setRegistroCedulaFecha((prev) => {
          // si justo estabas viendo una colilla de esa fecha, la limpiamos
          const f = prev?.fechaColilla ? String(prev.fechaColilla).slice(0, 10) : null;
          return f === fechaYYYYMMDD ? null : prev;
        });
        setRegistrosCedula((prev) =>
          (prev || []).filter((r) => String(r?.fechaColilla || "").slice(0, 10) !== fechaYYYYMMDD)
        );

        // Y limpiamos la lista por fecha (porque ya se borró)
        setRegistrosFecha([]);

        return response.data;
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Error eliminando nómina por fecha";
        setError(msg);
        console.error("Error deleteNominaByFecha:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiBaseUrl]
  );

  // ✅ Helper: obtener fechas disponibles desde los registros por cédula
  const getFechasDisponibles = useCallback(() => {
    return (registrosCedula || [])
      .map((r) => r?.fechaColilla)
      .filter(Boolean)
      .map((iso) => String(iso).slice(0, 10)); // "YYYY-MM-DD"
  }, [registrosCedula]);

  useEffect(() => {
    // sin carga inicial
  }, []);

  return (
    <NominaContext.Provider
      value={{
        loading,
        error,
        setError,

        // limpiar
        clearNomina,

        // upload
        uploadResult,
        uploadNomina,

        // búsquedas por cédula
        registrosCedula,
        setRegistrosCedula,
        fetchNominaByCedula,

        // cédula + fecha
        registroCedulaFecha,
        setRegistroCedulaFecha,
        fetchNominaByCedulaFecha,

        // ✅ NUEVO: por fecha
        registrosFecha,
        setRegistrosFecha,
        fetchNominaByFecha,

        // ✅ NUEVO: eliminar por fecha
        deleteResultFecha,
        deleteNominaByFecha,

        // helper
        getFechasDisponibles,
      }}
    >
      {children}
    </NominaContext.Provider>
  );
};

export const useNomina = () => useContext(NominaContext);
