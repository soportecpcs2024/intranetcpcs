import axios from "axios";

export const Metas = async (selectedGroup, selectedPeriodo) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/metas`, {
      params: {
        group: selectedGroup,
        periodo: selectedPeriodo,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching metas", error);
    throw error;
  }
};

// Update metas group
export const updateMetasGrupo = async (id, updatedData) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/metas/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating metas group", error);
    throw error;
  }
};
