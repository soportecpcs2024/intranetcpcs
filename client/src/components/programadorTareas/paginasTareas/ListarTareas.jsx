import { useContext, useState } from "react";
import { TareasContext } from "../../../contexts/TareaContext";
import "../DashboardProgramadorTareas/DashboardProgramadorTareas.css";

const ListarTareas = () => {
  const { tareas, loading, error, actualizarTarea } = useContext(TareasContext);
  const estados = ["Pendiente", "Terminado"]; // Pendiente a la izquierda
  const tareasPorPagina = 3;

  const [paginaActual, setPaginaActual] = useState({
    Pendiente: 1,
    Terminado: 1,
  });

  const tareasPorEstado = (estado) =>
    tareas.filter((tarea) => tarea.estado === estado);

  const cambiarPagina = (estado, nuevaPagina) => {
    setPaginaActual((prev) => ({
      ...prev,
      [estado]: nuevaPagina,
    }));
  };

  const toggleEstado = (tarea) => {
    const nuevoEstado = tarea.estado === "Pendiente" ? "Terminado" : "Pendiente";
    actualizarTarea(tarea._id, { estado: nuevoEstado });
  };

  if (loading) return <div className="loader">Cargando tareas...</div>;
  if (error) return <div className="error">Error al cargar tareas.</div>;

  return (
    <div className="kanban-container">
      {estados.map((estado) => {
        const tareasFiltradas = tareasPorEstado(estado);
        const totalPaginas = Math.ceil(tareasFiltradas.length / tareasPorPagina);
        const inicio = (paginaActual[estado] - 1) * tareasPorPagina;
        const tareasPaginadas = tareasFiltradas.slice(inicio, inicio + tareasPorPagina);

        return (
          <div key={estado} className="kanban-col">
            <h2 className="kanban-title">{estado}</h2>
            <div className="kanban-list">
              {tareasPaginadas.length === 0 ? (
                <p>No hay tareas en esta columna.</p>
              ) : (
                tareasPaginadas.map((tarea) => (
                  <div key={tarea._id} className={`kanban-card ${tarea.estado === "Terminado" ? "terminado" : "pendiente"}`}>
                    <h4>{tarea.titulo}</h4>
                    <p><strong>Sección:</strong> {tarea.seccion}</p>
                    <p><strong>Responsable:</strong> {tarea.responsable}</p>
                    <div className="fechaslistartareas">
                      <p><strong>Fecha creación: </strong>{new Date(tarea.fechaCreacion).toLocaleDateString()}</p>
                      <p><strong>Fecha límite:</strong> {new Date(tarea.fechaLimite).toLocaleDateString()}</p>
                    </div>
                    <p className="descripciontarea"><strong>Descripción:</strong> {tarea.descripcion}</p>
                    {tarea.observaciones && (
                      <p className="observacion">“{tarea.observaciones}”</p>
                    )}
                    {tarea.estado === "Pendiente" && (
                      <button 
                        onClick={() => toggleEstado(tarea)}
                        className="btn-toggle-estado"
                      >
                        Terminado
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {totalPaginas > 1 && (
              <div className="paginacion flechas">
                <button
                  onClick={() => cambiarPagina(estado, paginaActual[estado] - 1)}
                  disabled={paginaActual[estado] === 1}
                >
                  ⬅
                </button>
                <span>
                  Página {paginaActual[estado]} de {totalPaginas}
                </span>
                <button
                  onClick={() => cambiarPagina(estado, paginaActual[estado] + 1)}
                  disabled={paginaActual[estado] === totalPaginas}
                >
                  ➡
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ListarTareas;
