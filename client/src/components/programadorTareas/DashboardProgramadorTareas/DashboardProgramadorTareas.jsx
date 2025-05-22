import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './DashboardProgramadorTareas.css'; // Opcional: para estilos

const DashboardProgramadorTareas = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <Link to="crear" className="dashboard-link">Crear tarea</Link>
        <Link to="listar" className="dashboard-link">Listar tareas</Link>
        <Link to="estadisticas" className="dashboard-link">Estadísticas</Link>
      </header>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardProgramadorTareas;
