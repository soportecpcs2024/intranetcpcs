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
            const isSelectedMitad =
              selected && selected.costoAplicado === clase.costo / 2;

            return (
              <div key={clase._id} className="clase-item">
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

                  {/* Botón para seleccionar costo reducido al 50% */}
                  <button
                    onClick={() => {
                      const costoReducido = clase.costo / 2; // Calcular el 50% correctamente
                      handleSelectClase({
                        ...clase,
                        costoAplicado: costoReducido, // No es necesario Math.round() a menos que quieras redondear
                      });
                    }}
                    className={`clase-button-btn ${
                      isSelectedMitad ? "selected" : ""
                    }`}
                  >
                    50% Descuento
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

export default ListaClases;
