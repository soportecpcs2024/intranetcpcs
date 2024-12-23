
import axios from "axios";



export const verTodosLosUsuarios = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios`);
    return response;
  } catch (error) {
    console.error('Error fetching productos:', error);
    throw error;
  }
};
