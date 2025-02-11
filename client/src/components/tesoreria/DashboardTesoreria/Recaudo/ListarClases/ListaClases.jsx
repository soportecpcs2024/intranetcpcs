import React from "react";
import "./ListarClases.css"; // 👉 Importa el archivo CSS

const ListaClases = ({
  clases,
  selectedClases,
  handleSelectClase,
  loading,
}) => {
  return (
    <div className="lista-clases-container">
      <div>
        <h4 className="lista-clases-container-title">Selecciona las clases:</h4>
      </div>

      <div className="lista-clases-container-btn">
        {loading ? (
          <p>Cargando clases...</p>
        ) : clases.length === 0 ? (
          <p>No hay clases disponibles.</p>
        ) : (
          clases.map((clase) => (
            <button
              key={clase._id}
              onClick={() => handleSelectClase(clase)}
              className={`clase-button ${
                selectedClases.some((c) => c._id === clase._id)
                  ? "selected"
                  : ""
              }`}
            >
              {clase.nombre}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default ListaClases;
