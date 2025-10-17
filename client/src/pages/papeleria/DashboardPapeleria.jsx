 
import { Outlet } from "react-router-dom";
import SidebarPapeleria from "./SidebarPapeleria";

import "./DashboardPapeleria.css";
 
const DashboardPapeleria = () => {
  return (
    <div className="dashboard-papeleria">
      {/* Bloque izquierdo (Sidebar con íconos) */}
      <aside className="container sidebar-papeleria">
        <SidebarPapeleria />
      </aside>

      

      {/* Bloque derecho (contenido renderizado con Outlet) */}
      <main className="container contenido-papeleria">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardPapeleria;
