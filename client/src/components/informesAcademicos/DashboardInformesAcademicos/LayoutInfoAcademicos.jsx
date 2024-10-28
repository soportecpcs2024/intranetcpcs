import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import Footer from "../../../pages/admin/User/footer/Footer";
import { PiCertificateDuotone } from "react-icons/pi";
import { GrNotes } from "react-icons/gr";
import { CiDiscount1 } from "react-icons/ci";
import "./LayoutInfoAcademicos.css";

const LayoutInfoAcademicos = () => {
  return (
    <div className="layout-academico-container">
      <header className="layout-academico-container-header">
        <div className="link-academico">
          <PiCertificateDuotone className="icon-academico" />
          <NavLink
            to="certificado-estudios"
            className={({ isActive }) =>
              isActive ? "sidebar-link-academico active" : "sidebar-link-academico"
            }
          >
            <span>Certificado de Estudios</span>
          </NavLink>
        </div>

        <div className="link-academico">
          <GrNotes className="icon-academico" />
          <NavLink
            to="acumulados-notas"
            className={({ isActive }) =>
              isActive ? "sidebar-link-academico active" : "sidebar-link-academico"
            }
          >
            <span>Acumulados de Notas Final</span>
          </NavLink>
        </div>

        <div className="link-academico">
          <CiDiscount1 className="icon-academico" />
          <NavLink
            to="estadistico"
            className={({ isActive }) =>
              isActive ? "sidebar-link-academico active" : "sidebar-link-academico"
            }
          >
            <span>Estadístico</span>
          </NavLink>
        </div>
      </header>
      
      <main className="content-academico">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default LayoutInfoAcademicos;
