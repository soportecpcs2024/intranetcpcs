
import axios from "axios";

export const Students = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/student_notes`);
    return response.data;
  } catch (error) {
    console.error("Error logging in", error);
    throw error;
  }
};


export const StudentsSection = async (nivel) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/student_notes`, {
      params: { nivel },
    });
    return response.data;
  } catch (error) {
    console.error("Error obteniendo las notas por sección", error);
    throw error;
  }
};
export const StudentsSectionPromedioMaterias = async (nivel) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/student_notes/promedio-materia-grupo`, {
      params: { nivel },
    });
    return response.data;
  } catch (error) {
    console.error("Error obteniendo las notas por sección", error);
    throw error;
  }
};


export const StudentsNS = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/ns`);
    return response.data;
  } catch (error) {
    console.error("Error logging in", error);
    throw error;
  }
};
export const LlegadasTardeData = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/llegadastarde`);
    return response.data;
  } catch (error) {
    console.error("Error logging in", error);
    throw error;
  }
};
export const crearLlegadasTardeData = async (nuevaLlegada) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/llegadastarde`, nuevaLlegada, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating tardiness entry", error);
    throw error;
  }
};

 

export const verTodosLosProductos = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products`);
    return response;
  } catch (error) {
    console.error('Error fetching productos:', error);
    throw error;
  }
};

export const verTodosLosUsuarios = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios`);
    return response;
  } catch (error) {
    console.error('Error fetching productos:', error);
    throw error;
  }
};
