import React from "react";
import "./ListarClases.css"; // 👉 Importa el archivo CSS

const ListaClasesEscuelaPadres = ({
  clases,
  selectedClases,
  handleSelectClase,
  loading,
}) => {
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
            // Verificar si la clase está seleccionada y con qué costo
            const selected = selectedClases.find((c) => c._id === clase._id);
            const isSelectedNormal =
              selected && selected.costoAplicado === clase.costo;
            

            return (
              <div key={clase._id} className="clase-item antologia">
               
                <div className="clase-item-content-btn">
                  {/* Botón para seleccionar costo normal */}
                  <button
                    onClick={() =>
                      handleSelectClase({
                        ...clase,
                        costoAplicado: clase.costo,
                      })
                    }
                    className={`clase-button ${
                      isSelectedNormal ? "selected" : ""
                    }`}
                  >
                    {clase.nombre}
                  </button>

                  
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ListaClasesEscuelaPadres;
