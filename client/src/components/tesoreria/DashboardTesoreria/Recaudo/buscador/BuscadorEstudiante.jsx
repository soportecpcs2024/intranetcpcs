import React, { useState } from "react";
import './BuscadorEstudiantes.css'

const BuscadorEstudiante = ({
  fetchEstudianteById,
  setEstudiante,
  setLoading,
  limpiarBuscador,
  estudiante
}) => {
  const [searchId, setSearchId] = useState("");

  const handleSearch = async () => {
    if (!searchId.trim()) return;
    setLoading(true);
  
    const formattedSearchId = searchId.trim().toUpperCase(); 
    const result = await fetchEstudianteById(formattedSearchId);
  
    if (!result) {
      alert("Estudiante no encontrado"); // Mostrar una alerta si no se encuentra
      setEstudiante(null); // Limpiar el estado del estudiante
    } else {
      setEstudiante(result);
    }
  
    setSearchId(""); // Limpiar el input después de buscar
    setLoading(false);
  };
  
  

  return (
    <div>
      <div className="content_buscador_estudiante_recaudo">
        <div>
          <h4>Estudiante:</h4>
        </div>
        <div>
          <input
            type="text"
            placeholder="Ingrese el nombre"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
        </div>  
        <div>
          <button onClick={handleSearch}>Buscar</button>
        </div>

        
      {estudiante && (
        <div  >
         
          <p>
            {estudiante.nombre}
          </p>
          
        </div>
      )}
      </div>
    </div>
  );
};

export default BuscadorEstudiante;
