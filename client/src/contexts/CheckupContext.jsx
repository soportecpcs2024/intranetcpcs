import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

export const CheckupContext = createContext();

export const CheckupProvider = ({ children }) => {
  const [planActivo, setPlanActivo] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [weeklyCheckups, setWeeklyCheckups] = useState([]);
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const baseURL = import.meta.env.VITE_BACKEND_URL;

  // ✅ Header de auth para rutas protegidas (asureAuth)
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  };

  const clearError = () => setError(null);

  /*
  =========================
  PLAN
  =========================
  */

  const obtenerPlanActivo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        `${baseURL}/api/checkups/plan-activo`,
        getAuthHeaders()
      );

      setPlanActivo(res.data);
      return res.data;
    } catch (err) {
      console.error("Error obteniendo plan activo:", err);
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [baseURL]);

  const crearPlan = useCallback(
    async (payload) => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.post(
          `${baseURL}/api/checkups/plan`,
          payload,
          getAuthHeaders()
        );

        // si el backend devuelve el plan creado, lo guardamos
        setPlanActivo(res.data);
        return res.data;
      } catch (err) {
        console.error("Error creando plan:", err);
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [baseURL]
  );

  /*
  =========================
  BANCO DE PREGUNTAS
  =========================
  */

  // GET /api/checkups/preguntas?area=...&periodo=...
  const obtenerPreguntas = useCallback(
    async ({ area, periodo }) => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          `${baseURL}/api/checkups/preguntas`,
          {
            ...getAuthHeaders(),
            params: { area, periodo },
          }
        );

        setPreguntas(res.data);
        return res.data;
      } catch (err) {
        console.error("Error obteniendo preguntas:", err);
        setError(err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [baseURL]
  );

  /*
  =========================
  CHEQUEO SEMANAL
  =========================
  */

  // POST /api/checkups/semanal (crea o actualiza)
  const upsertWeeklyCheckup = useCallback(
    async (payload) => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.post(
          `${baseURL}/api/checkups/semanal`,
          payload,
          getAuthHeaders()
        );

        // opcional: refrescar historial luego de guardar
        // await listarWeeklyCheckups();
        return res.data;
      } catch (err) {
        console.error("Error guardando chequeo semanal:", err);
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [baseURL]
  );

  // GET /api/checkups/semanal (historial)
  const listarWeeklyCheckups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        `${baseURL}/api/checkups/semanal`,
        getAuthHeaders()
      );

      setWeeklyCheckups(res.data);
      return res.data;
    } catch (err) {
      console.error("Error listando chequeos:", err);
      setError(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [baseURL]);


  // ✅ GET /api/checkups/semanal?area=...&periodo=...&weekStart=...
// Devuelve el chequeo de esa semana (si existe)
const obtenerWeeklyCheckup = useCallback(
  async ({ area, periodo, weekStart, grupo }) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`${baseURL}/api/checkups/semanal`, {
        ...getAuthHeaders(),
        params: { area, periodo, weekStart, grupo },
      });

      return res.data;
    } catch (err) {
      if (err?.response?.status === 404) return null;
      console.error("Error obteniendo chequeo semanal:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  },
  [baseURL]
);
  /*
  =========================
  DASHBOARD
  =========================
  */

  // GET /api/checkups/dashboard
  const obtenerDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        `${baseURL}/api/checkups/dashboard`,
        getAuthHeaders()
      );

      setDashboard(res.data);
      return res.data;
    } catch (err) {
      console.error("Error obteniendo dashboard stats:", err);
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [baseURL]);

  /*
  =========================
  AUTO-CARGA INICIAL
  =========================
  */
  useEffect(() => {
    // si no hay token, no intentamos llamar rutas protegidas
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    obtenerPlanActivo();
  }, [obtenerPlanActivo]);

  const value = useMemo(
    () => ({
      // state
      planActivo,
      preguntas,
      weeklyCheckups,
      dashboard,
      loading,
      error,
      obtenerWeeklyCheckup,

      // actions
      clearError,
      crearPlan,
      obtenerPlanActivo,
      obtenerPreguntas,
      upsertWeeklyCheckup,
      listarWeeklyCheckups,
      obtenerDashboardStats,
      
    }),
    [
      planActivo,
      preguntas,
      weeklyCheckups,
      dashboard,
      loading,
      error,
      crearPlan,
      obtenerPlanActivo,
      obtenerPreguntas,
      upsertWeeklyCheckup,
      listarWeeklyCheckups,
      obtenerDashboardStats,
      obtenerWeeklyCheckup,
    ]
  );

  return <CheckupContext.Provider value={value}>{children}</CheckupContext.Provider>;
};