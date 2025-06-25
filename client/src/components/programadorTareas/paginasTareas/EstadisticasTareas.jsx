import { useContext } from "react";
import { TareasContext } from "../../../contexts/TareaContext";
import "../DashboardProgramadorTareas/DashboardProgramadorTareas.css";

const EstadisticasTareas = () => {
   const { tareas, loading, error } = useContext(TareasContext);

  if (loading) return <div className="loader">Cargando tareas terminadas...</div>;
  if (error) return <div className="error">Error al cargar tareas.</div>;

  const tareasTerminadas = tareas.filter(t => t.estado === "Terminado");
 return (
    <div className="lista-tareas-terminadas">
      <h2 className="kanban-title">INFORMACION GENERAL</h2>

      {tareasTerminadas.length === 0 ? (
        <p>No hay tareas terminadas.</p>
      ) : (
        <ul className="lista-simple">
          {tareasTerminadas.map((tarea) => (
            <li key={tarea._id} className="item-tarea">
              <h4>{tarea.titulo}</h4>
              <p><strong>Descripción:</strong> {tarea.descripcion}</p>
              <p><strong>Responsable:</strong> <span style={{ textTransform: "capitalize" }}>{tarea.responsable.toLowerCase()}</span></p>
              
            
              
              
              <p><strong>Cumplimiento:</strong> {tarea.cumplimiento}</p>
              {tarea.observaciones && tarea.observaciones.trim() !== "" && (
                <p><strong>Observaciones:</strong> {tarea.observaciones}</p>
              )}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EstadisticasTareas;

