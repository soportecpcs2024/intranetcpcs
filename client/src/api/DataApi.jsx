
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
