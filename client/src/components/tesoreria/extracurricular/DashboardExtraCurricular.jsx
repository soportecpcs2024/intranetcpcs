import { Outlet, NavLink } from "react-router-dom";
import Footer from "../../../pages/admin/User/footer/Footer";

import "./extracurricular.css";

const DashboardExtraCurricular = () => {
  return (
    <div className="layout-extraclases-container">
      <div className="link-extraclases">

        <div className="grup-links">
          <NavLink to="ingles">Inglés</NavLink>
          <NavLink to="iniciamusical">Iniciación musical</NavLink>
          <NavLink to="piano">Piano</NavLink>
        </div>

        <div className="grup-links">
          <NavLink to="tecnicavocal">Técnica Vocal</NavLink>
          <NavLink to="guitarrabajo">Guitarra y Bajo</NavLink>
          <NavLink to="bateria">Bateria</NavLink>
        </div>

        <div className="grup-links">
          <NavLink to="baloncesto">Baloncesto</NavLink>
          <NavLink to="voleibol">Voleibol</NavLink>
          <NavLink to="microfutbol">Microfutbol</NavLink>
        </div>

        <div className="grup-links">
          <NavLink to="arte">Arte</NavLink>
          <NavLink to="exploracionmotriz">Exploración Motriz</NavLink>
        </div>

        
      </div>

     

      <main className="content-academico">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default DashboardExtraCurricular;
