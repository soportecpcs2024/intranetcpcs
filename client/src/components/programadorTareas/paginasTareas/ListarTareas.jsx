import { useContext } from "react";
import { TareasContext } from "../../../contexts/TareaContext";
import "../DashboardProgramadorTareas/DashboardProgramadorTareas.css";

const ListarTareas = () => {
  const { tareas, loading, error, actualizarTarea } = useContext(TareasContext);

  const estados = ["Pendiente", "Terminado"];

  const tareasPorEstado = (estado) =>
    tareas.filter((tarea) => tarea.estado === estado);

  const toggleEstado = (tarea) => {
    const nuevoEstado = tarea.estado === "Pendiente" ? "Terminado" : "Pendiente";
    actualizarTarea(tarea._id, { estado: nuevoEstado });
  };

  if (loading) return <div className="loader">Cargando tareas...</div>;
  if (error) return <div className="error">Error al cargar tareas.</div>;

  return (
    <div className="kanban-container">
      {estados.map((estado) => (
        <div key={estado} className="kanban-column">
          <h2 className="kanban-title">{estado}</h2>
          <div className="kanban-list">
            {tareasPorEstado(estado).length === 0 ? (
              <p>No hay tareas en esta columna.</p>
            ) : (
              tareasPorEstado(estado).map((tarea) => (
                <div key={tarea._id} className="kanban-card">
                  <h4>{tarea.titulo}</h4>
                  <p><strong>Sección:</strong> {tarea.seccion}</p>
                  <p><strong>Responsable:</strong> {tarea.responsable}</p>
                  <div className="fechaslistartareas">
                  <p><strong>Fecha de creación: </strong>{new Date(tarea.fechaCreacion).toLocaleDateString()}</p>
                  <p><strong>Fecha límite:</strong> {new Date(tarea.fechaLimite).toLocaleDateString()}</p>
                  </div>
                  <p className="descripciontarea"><strong>Descripción:</strong> {tarea.descripcion}</p>
                  {tarea.observaciones && (
                    <p className="observacion">“{tarea.observaciones}”</p>
                  )}
                  <button 
                    onClick={() => toggleEstado(tarea)}
                    className="btn-toggle-estado"
                  >
                    {tarea.estado === "Pendiente" ? "Terminado" : "Pendiente"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListarTareas;
