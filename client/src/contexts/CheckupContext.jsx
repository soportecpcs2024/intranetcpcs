import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";

export const CheckupContext = createContext();

export const CheckupProvider = ({ children }) => {
  const [planActivo, setPlanActivo] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [weeklyCheckups, setWeeklyCheckups] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [dashboardInstitucional, setDashboardInstitucional] = useState(null);
  const [grupos, setGrupos] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const baseURL = import.meta.env.VITE_BACKEND_URL;

  // Header auth para rutas protegidas
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
        getAuthHeaders(),
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
          getAuthHeaders(),
        );

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
    [baseURL],
  );

  /*
  =========================
  BANCO DE PREGUNTAS
  =========================
  */

  const obtenerPreguntas = useCallback(
    async ({ area, periodo, planId } = {}) => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`${baseURL}/api/checkups/preguntas`, {
          ...getAuthHeaders(),
          params: { area, periodo, planId },
        });

        setPreguntas(res.data);
        return res.data;
      } catch (err) {
        console.error("Error obteniendo preguntas:", err);
        setError(err);
        setPreguntas([]);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [baseURL],
  );

  /*
  =========================
  CHEQUEO SEMANAL
  =========================
  */

  const upsertWeeklyCheckup = useCallback(
    async (payload) => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.post(
          `${baseURL}/api/checkups/semanal`,
          payload,
          getAuthHeaders(),
        );

        return res.data;
      } catch (err) {
        console.error("Error guardando chequeo semanal:", err);
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [baseURL],
  );

  const listarWeeklyCheckups = useCallback(
    async ({ area, periodo, grupo, from, to, planId } = {}) => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`${baseURL}/api/checkups/semanal`, {
          ...getAuthHeaders(),
          params: { area, periodo, grupo, from, to, planId },
        });

        setWeeklyCheckups(res.data || []);
        return res.data || [];
      } catch (err) {
        console.error("Error listando chequeos:", err);
        setError(err);
        setWeeklyCheckups([]);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [baseURL],
  );

  // Devuelve el chequeo puntual de esa semana si existe
  const obtenerWeeklyCheckup = useCallback(
    async ({ area, periodo, weekStart, grupo, planId } = {}) => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`${baseURL}/api/checkups/semanal/uno`, {
          ...getAuthHeaders(),
          params: { area, periodo, weekStart, grupo, planId },
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
    [baseURL],
  );

  /*
  =========================
  DASHBOARD PERSONAL
  =========================
  */

  const obtenerDashboardStats = useCallback(
    async ({ area, periodo, grupo, from, to, planId } = {}) => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`${baseURL}/api/checkups/dashboard`, {
          ...getAuthHeaders(),
          params: {
            area,
            periodo,
            grupo: grupo?.trim?.() || "",
            from,
            to,
            planId,
          },
        });

        setDashboard(res.data);
        return res.data;
      } catch (err) {
        console.error("Error obteniendo dashboard stats:", err);
        setError(err);
        setDashboard(null);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [baseURL],
  );

  /*
  =========================
  DASHBOARD INSTITUCIONAL
  =========================
  */

  const obtenerDashboardInstitucional = useCallback(
    async ({ area, periodo, grupo, from, to, planId } = {}) => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          `${baseURL}/api/checkups/dashboard/institucional`,
          {
            ...getAuthHeaders(),
            params: {
              area,
              periodo,
              grupo: grupo?.trim?.() || "",
              from,
              to,
              planId,
            },
          },
        );

        setDashboardInstitucional(res.data);
        return res.data;
      } catch (err) {
        console.error("Error obteniendo dashboard institucional:", err);
        setError(err);
        setDashboardInstitucional(null);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [baseURL],
  );

  /*
  =========================
  GRUPOS
  =========================
  */

  const listarGrupos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`${baseURL}/api/grupos`, getAuthHeaders());

      setGrupos(res.data || []);
      return res.data || [];
    } catch (err) {
      console.error("Error listando grupos:", err);
      setError(err);
      setGrupos([]);
      return [];
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
      dashboardInstitucional,
      grupos,
      loading,
      error,

      // actions
      clearError,
      crearPlan,
      obtenerPlanActivo,
      obtenerPreguntas,
      upsertWeeklyCheckup,
      listarWeeklyCheckups,
      obtenerWeeklyCheckup,
      obtenerDashboardStats,
      obtenerDashboardInstitucional,
      listarGrupos,
    }),
    [
      planActivo,
      preguntas,
      weeklyCheckups,
      dashboard,
      dashboardInstitucional,
      grupos,
      loading,
      error,
      crearPlan,
      obtenerPlanActivo,
      obtenerPreguntas,
      upsertWeeklyCheckup,
      listarWeeklyCheckups,
      obtenerWeeklyCheckup,
      obtenerDashboardStats,
      obtenerDashboardInstitucional,
      listarGrupos,
    ],
  );

  return (
    <CheckupContext.Provider value={value}>
      {children}
    </CheckupContext.Provider>
  );
};