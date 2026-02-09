// src/context/NominaContext.jsx
import { createContext, useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";

const NominaContext = createContext();

export const NominaProvider = ({ children }) => {
  const apiBaseUrl = import.meta.env.VITE_BACKEND_URL;

  // loading real para acciones (subir/buscar)
  const [loading, setLoading] = useState(false);

  // estados
  const [uploadResult, setUploadResult] = useState(null);
  const [registrosCedula, setRegistrosCedula] = useState([]); // TODOS por cédula
  const [registroCedulaFecha, setRegistroCedulaFecha] = useState(null); // UNO por cédula+fecha
  const [error, setError] = useState(null);

  // ✅ Limpiar todo lo relacionado con nómina (para botón "Limpiar")
  const clearNomina = useCallback(() => {
    setError(null);
    setUploadResult(null);
    setRegistrosCedula([]);
    setRegistroCedulaFecha(null);
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

  // ✅ Helper: obtener fechas disponibles desde los registros por cédula
  const getFechasDisponibles = useCallback(() => {
    return (registrosCedula || [])
      .map((r) => r?.fechaColilla)
      .filter(Boolean)
      .map((iso) => String(iso).slice(0, 10)); // "YYYY-MM-DD"
  }, [registrosCedula]);

  // Carga inicial (no es obligatorio cargar nada)
  useEffect(() => {
    // ya no usamos loading inicial
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

        // búsquedas
        registrosCedula,
        setRegistrosCedula, // por si lo necesitas
        fetchNominaByCedula,

        registroCedulaFecha,
        setRegistroCedulaFecha, // por si lo necesitas
        fetchNominaByCedulaFecha,

        // helper
        getFechasDisponibles,
      }}
    >
      {children}
    </NominaContext.Provider>
  );
};

export const useNomina = () => useContext(NominaContext);
