import React from "react";

const ListarClasesAlmuerzo = ({ clases, selectedClases, handleSelectClase, loading }) => {
  return (
    <div className="lista-clases-container">
      <h4 className="lista-clases-container-title">Selecciona las clases:</h4>

      <div className="lista-clases-container-btn">
        {loading ? (
          <p>Cargando clases...</p>
        ) : clases.length === 0 ? (
          <p>No hay clases disponibles.</p>
        ) : (
          clases.map((clase) => {
            return (
              <div key={clase._id} className="clase-item">
                <div className="clase-item-content-btn">
                  {/* Botón para agregar almuerzo */}
                  <button
                    onClick={() => handleSelectClase(clase)}
                    className="clase-button"
                  >
                    {clase.nombre}
                  </button>
                  <button
                    onClick={() => handleSelectClase(clase)}
                    className="add-button"
                  >
                    ➕
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Sección de Almuerzos Seleccionados */}
      <div className="selected-clases-container">
        <h4>Almuerzos Seleccionados:</h4>
        {selectedClases.length === 0 ? (
          <p>No has seleccionado ningún almuerzo.</p>
        ) : (
          <ul>
            {selectedClases.map((clase) => (
              <li key={clase._id} className="selected-clase-item">
                <span>
                  {clase.nombre} - ${clase.costo} x {clase.cantidad}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ListarClasesAlmuerzo;
