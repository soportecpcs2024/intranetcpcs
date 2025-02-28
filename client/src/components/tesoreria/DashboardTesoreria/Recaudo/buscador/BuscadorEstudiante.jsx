import React, { useState, useEffect } from "react";
import { useRecaudo } from "../../../../../contexts/RecaudoContext"; 
import "./BuscadorEstudiantes.css";


const BuscadorEstudiante = ({ setEstudiante, setLoading, limpiarCampos }) => {
  const [searchId, setSearchId] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const { fetchEstudianteById } = useRecaudo();
  const apiBaseUrl = import.meta.env.VITE_BACKEND_URL;


  useEffect(() => {
    if (limpiarCampos) {
      setSearchId(""); // Limpiar el input
      setSelectedEstudiante(null);
    }
  }, [limpiarCampos]); // Ejecutar cuando limpiarCampos cambie   
  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`${apiBaseUrl}/api/recaudo/estudiantes?nombre=${query}`);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error al obtener sugerencias:", error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchId(value);
    fetchSuggestions(value);
  };

  
  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    if (selectedId) {
      const estudianteSeleccionado = suggestions.find((est) => est._id === selectedId);
      if (estudianteSeleccionado) {
        setSearchId(estudianteSeleccionado.nombre);
        setEstudiante(estudianteSeleccionado);
        setSelectedEstudiante(estudianteSeleccionado);
        setSuggestions([]);
      }
    }
  };



  const handleSearch = async () => {
    if (!searchId.trim()) return;
    setLoading(true);
    const formattedSearchId = searchId.trim().toUpperCase();
    const result = await fetchEstudianteById(formattedSearchId);
    if (!result) {
      alert("Estudiante no encontrado");
      limpiarCampos();  // Llama la función para limpiar
    } else {
      setEstudiante(result);
      setSelectedEstudiante(result);
    }
    setLoading(false);
  };

  return (
    <div className="content_buscador_estudiante_recaudo">
      <h4>Estudiante:</h4>
      <div className="input-container">
        <input
          type="text"
          placeholder="Ingrese el nombre"
          value={searchId}
          onChange={handleInputChange}
        />
        {suggestions.length > 0 && (
          <select onChange={handleSelectChange} className="dropdown-list">
            <option value="">Selecciona estudiante</option>
            {suggestions.map((est) => (
              <option key={est._id} value={est._id}>
                {est.nombre}
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedEstudiante && <p>{selectedEstudiante.nombre}</p>}
    </div>
  );
};

export default BuscadorEstudiante;
