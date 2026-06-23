import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const EscuelaPadresContext = createContext();

export const useEscuelaPadres = () => useContext(EscuelaPadresContext);

export const EscuelaPadresProvider = ({ children }) => {
  const [escuelas, setEscuelas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [asistUnificadas, setAsistUnificadas] = useState([]);
  const [asistenciaActual, setAsistenciaActual] = useState(null);

  // Históricos
  const [historicos, setHistoricos] = useState([]);
  const [historicoActual, setHistoricoActual] = useState(null);

  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  // =========================
  // ESCUELAS
  // =========================

  const cargarEscuelas = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/epEscuelas`);
      setEscuelas(res.data);
    } catch (err) {
      console.error('❌ Error al cargar escuelas:', err);
    }
  };

  const crearEscuela = async (escuelaData) => {
    try {
      const res = await axios.post(`${API_BASE}/api/epEscuelas`, escuelaData);
      await cargarEscuelas();
      return res.data;
    } catch (err) {
      console.error('❌ Error al crear escuela:', err);
      throw err;
    }
  };

  const actualizarEscuela = async (id, datos) => {
    try {
      const res = await axios.put(`${API_BASE}/api/epEscuelas/${id}`, datos);
      await cargarEscuelas();
      return res.data;
    } catch (err) {
      console.error('❌ Error al actualizar escuela:', err);
      throw err;
    }
  };

  const eliminarEscuela = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/epEscuelas/${id}`);
      await cargarEscuelas();
    } catch (err) {
      console.error('❌ Error al eliminar escuela:', err);
      throw err;
    }
  };

  // =========================
  // ESTUDIANTES
  // =========================

  const buscarEstudiantes = async (query) => {
    try {
      const res = await axios.get(`${API_BASE}/api/epEstudiantes/buscar?q=${query}`);
      setEstudiantes(res.data);
    } catch (err) {
      console.error('❌ Error al buscar estudiantes:', err);
    }
  };

  const crearEstudiante = async (estudiante) => {
    const { nombre, num_identificacion, grupo } = estudiante;

    if (!nombre || !num_identificacion || !grupo) {
      alert('⚠️ Por favor completa todos los campos');
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/api/epEstudiantes`, {
        nombre,
        num_identificacion,
        grupo,
      });

      return res.data;
    } catch (err) {
      console.error('❌ Error al crear estudiante:', err);
      alert('❌ Ocurrió un error al crear el estudiante.');
      throw err;
    }
  };

  const cargarTodosLosEstudiantes = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/epEstudiantes`);
      setEstudiantes(res.data);
      return res.data;
    } catch (err) {
      console.error('❌ Error al cargar todos los estudiantes:', err);
      setEstudiantes([]);
      return [];
    }
  };

  // =========================
  // ASISTENCIAS
  // =========================

  const obtenerAsistencia = async (escuelaPadresId, estudianteId) => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/epasistencias/obtener/${escuelaPadresId}/${estudianteId}`
      );

      setAsistenciaActual({ ...res.data });
      return res.data;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setAsistenciaActual(null);
      } else {
        console.error('❌ Error al obtener asistencia:', err);
      }

      return null;
    }
  };

  const crearAsistencia = async (datos) => {
    try {
      const res = await axios.post(`${API_BASE}/api/epAsistencias`, datos);

      if (!res.data?.asistencia) {
        throw new Error('Respuesta inválida al crear asistencia');
      }

      setAsistenciaActual({ ...res.data.asistencia });
      return res.data;
    } catch (err) {
      console.error('❌ Error al crear asistencia:', err);
      throw err;
    }
  };

  const actualizarAsistencia = async (id, datos) => {
    try {
      const res = await axios.put(
        `${API_BASE}/api/epAsistencias/actualizar/${id}`,
        datos
      );

      if (!res.data?.asistencia) {
        throw new Error('Respuesta inválida al actualizar asistencia');
      }

      setAsistenciaActual({ ...res.data.asistencia });
      return res.data;
    } catch (err) {
      console.error('❌ Error al actualizar asistencia:', err);
      throw err;
    }
  };

  const asistenciasUnificadas = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/epAsistencias/unificada`);
      setAsistUnificadas(res.data);
      return res.data;
    } catch (error) {
      console.error('❌ Error al obtener asistencias unificadas:', error);
      setAsistUnificadas([]);
      return [];
    }
  };

  const descargarAsistenciasJSON = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/epAsistencias/asistencias-unificadas-json`,
        {
          responseType: 'blob',
        }
      );

      const blob = new Blob([response.data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'asistencias_ep_.json');

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('❌ Error descargando asistencias EP JSON:', error);
      alert('No se pudo descargar el archivo JSON');
    }
  };

  // =========================
  // HISTÓRICOS
  // =========================

  const cargarHistoricos = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE}/api/ephistorico`);

      setHistoricos(res.data.data || []);
      return res.data.data || [];
    } catch (err) {
      console.error('❌ Error al cargar históricos:', err);
      setHistoricos([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const crearHistorico = async (historicoData) => {
    try {
      const res = await axios.post(`${API_BASE}/api/ephistorico`, historicoData);

      await cargarHistoricos();

      return res.data;
    } catch (err) {
      console.error('❌ Error al crear histórico:', err);
      throw err;
    }
  };

  const buscarHistoricoPorDocumento = async (documento) => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/ephistorico/documento/${documento}`
      );

      setHistoricos(res.data.data || []);
      return res.data.data || [];
    } catch (err) {
      console.error('❌ Error al buscar histórico por documento:', err);
      setHistoricos([]);
      return [];
    }
  };

  const buscarHistoricoPorPeriodo = async (periodo) => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/ephistorico/periodo/${periodo}`
      );

      setHistoricos(res.data.data || []);
      return res.data.data || [];
    } catch (err) {
      console.error('❌ Error al buscar histórico por periodo:', err);
      setHistoricos([]);
      return [];
    }
  };

  const actualizarHistorico = async (id, datos) => {
    try {
      const res = await axios.put(`${API_BASE}/api/ephistorico/${id}`, datos);

      await cargarHistoricos();

      return res.data;
    } catch (err) {
      console.error('❌ Error al actualizar histórico:', err);
      throw err;
    }
  };

  const eliminarHistorico = async (id) => {
    try {
      const res = await axios.delete(`${API_BASE}/api/ephistorico/${id}`);

      await cargarHistoricos();

      return res.data;
    } catch (err) {
      console.error('❌ Error al eliminar histórico:', err);
      throw err;
    }
  };

  // =========================
  // USE EFFECT
  // =========================

  useEffect(() => {
    cargarEscuelas();
  }, []);

  return (
    <EscuelaPadresContext.Provider
      value={{
        escuelas,
        estudiantes,
        asistUnificadas,
        asistenciaActual,
        setAsistenciaActual,
        loading,

        buscarEstudiantes,
        crearEstudiante,
        cargarTodosLosEstudiantes,

        obtenerAsistencia,
        crearAsistencia,
        actualizarAsistencia,
        asistenciasUnificadas,
        descargarAsistenciasJSON,

        crearEscuela,
        actualizarEscuela,
        eliminarEscuela,
        cargarEscuelas,

        historicos,
        historicoActual,
        setHistoricoActual,
        cargarHistoricos,
        crearHistorico,
        buscarHistoricoPorDocumento,
        buscarHistoricoPorPeriodo,
        actualizarHistorico,
        eliminarHistorico,
      }}
    >
      {children}
    </EscuelaPadresContext.Provider>
  );
};