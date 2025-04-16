import React, { useState, useEffect } from "react";
import { useRecaudo } from "../../../../../contexts/RecaudoContext";
import "./BuscadorEstudiantes.css";

const BuscadorEstudiante = ({ setEstudiante, setLoading, limpiarCampos }) => {
  const [searchText, setSearchText] = useState("");
  const [allSuggestions, setAllSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const { fetchEstudianteById } = useRecaudo();
  const apiBaseUrl = import.meta.env.VITE_BACKEND_URL;

  // Reset fields on limpiarCampos
  useEffect(() => {
    if (limpiarCampos) {
      setSearchText("");
      setSelectedEstudiante(null);
      setFilteredSuggestions([]);
    }
  }, [limpiarCampos]);

  // Fetch all suggestions once when user types first time
  const fetchAllSuggestions = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/recaudo/estudiantes`);
      const data = await response.json();
      setAllSuggestions(data);
    } catch (error) {
      console.error("Error al obtener estudiantes:", error);
    }
  };

  // Filter as user types
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (value.trim().length === 0) {
      setFilteredSuggestions([]);
      return;
    }

    // Fetch once
    if (allSuggestions.length === 0) {
      fetchAllSuggestions();
    }

    const filtered = allSuggestions.filter((est) =>
      est.nombre.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredSuggestions(filtered);
  };

  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    const estudiante = allSuggestions.find((est) => est._id === selectedId);
    if (estudiante) {
      setSearchText(estudiante.nombre);
      setEstudiante(estudiante);
      setSelectedEstudiante(estudiante);
      setFilteredSuggestions([]);
    }
  };

  const handleSearch = async () => {
    if (!searchText.trim()) return;
    setLoading(true);
    const formatted = searchText.trim().toUpperCase();
    const result = await fetchEstudianteById(formatted);
    if (!result) {
      alert("Estudiante no encontrado");
      limpiarCampos();
    } else {
      setEstudiante(result);
      setSelectedEstudiante(result);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="content_buscador_estudiante_recaudo">
      <h4>Estudiante:</h4>
      <div className="input-container">
        <input
          type="text"
          placeholder="Ingrese el nombre"
          value={searchText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          list="estudiantes-list"
        />
        <datalist id="estudiantes-list">
          {filteredSuggestions.map((est) => (
            <option key={est._id} value={est.nombre} />
          ))}
        </datalist>

        {/* Fallback select if needed */}
        {filteredSuggestions.length > 0 && (
          <select
            onChange={handleSelectChange}
            className="dropdown-list"
            value={selectedEstudiante ? selectedEstudiante._id : ""}
          >
            <option value="">Selecciona estudiante</option>
            {filteredSuggestions.map((est) => (
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
  
