import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const EscuelaPadresContext = createContext();

export const useEscuelaPadres = () => useContext(EscuelaPadresContext);

export const EscuelaPadresProvider = ({ children }) => {
  const [escuelas, setEscuelas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [asistenciaActual, setAsistenciaActual] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = 'http://localhost:3000';

  // 🔄 Cargar escuelas de padres
  const cargarEscuelas = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/epEscuelas`);
      setEscuelas(res.data);
    } catch (err) {
      console.error('❌ Error al cargar escuelas:', err);
    }
  };

  // 🔍 Buscar estudiantes por nombre
  const buscarEstudiantes = async (query) => {
    try {
      const res = await axios.get(`${API_BASE}/api/epEstudiantes/buscar?q=${query}`);
      setEstudiantes(res.data);
    } catch (err) {
      console.error('❌ Error al buscar estudiantes:', err);
    }
  };

  // ✅ Crear estudiante
  const crearEstudiante = async (estudiante) => {
    const { nombre, num_identificacion, grupo } = estudiante;

    if (!nombre || !num_identificacion || !grupo) {
      alert("⚠️ Por favor completa todos los campos");
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
      alert("❌ Ocurrió un error al crear el estudiante.");
      throw err;
    }
  };

  // 📥 Obtener asistencia por escuela + estudiante
const obtenerAsistencia = async (escuelaPadresId, estudianteId) => {
  try {
    const res = await axios.get(`${API_BASE}/api/epasistencias/obtener/${escuelaPadresId}/${estudianteId}`);
    setAsistenciaActual({ ...res.data }); // nueva referencia
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      // No mostrar error si es porque no existe el registro aún
      setAsistenciaActual(null);
    } else {
      // Solo mostrar en consola si es otro tipo de error
      console.error('❌ Error al obtener asistencia:', err);
    }
    return null;
  }
};



  // 📝 Crear asistencia
  const crearAsistencia = async (datos) => {
    try {
      const res = await axios.post(`${API_BASE}/api/epAsistencias`, datos);
      if (!res.data?.asistencia) throw new Error("Respuesta inválida al crear asistencia");
      setAsistenciaActual({ ...res.data.asistencia });
      return res.data;
    } catch (err) {
      console.error('❌ Error al crear asistencia:', err);
      throw err;
    }
  };

  // 🔁 Actualizar asistencia
  const actualizarAsistencia = async (id, datos) => {
    try {
      const res = await axios.put(`${API_BASE}/api/epAsistencias/actualizar/${id}`, datos);
      if (!res.data?.asistencia) throw new Error("Respuesta inválida al actualizar asistencia");
      setAsistenciaActual({ ...res.data.asistencia });
      return res.data;
    } catch (err) {
      console.error('❌ Error al actualizar asistencia:', err);
      throw err;
    }
  };

  useEffect(() => {
    cargarEscuelas();
  }, []);

  return (
    <EscuelaPadresContext.Provider
      value={{
        escuelas,
        estudiantes,
        asistenciaActual,
        setAsistenciaActual,
        buscarEstudiantes,
        crearEstudiante,
        obtenerAsistencia,
        crearAsistencia,
        actualizarAsistencia,
        loading,
      }}
    >
      {children}
    </EscuelaPadresContext.Provider>
  );
};
