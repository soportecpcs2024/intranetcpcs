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
          <NavLink
            to="certificado-estudios"
            className={({ isActive }) =>
              isActive
                ? "sidebar-link-academico active"
                : "sidebar-link-academico"
            }
          >
            <div className="link-academico-b">
              <PiCertificateDuotone className="icon-academico" />
              <span>Constancia de desempeño</span>
            </div>
          </NavLink>
        </div>

        <div className="link-academico">
          <NavLink
            to="acumulados-notas"
            className={({ isActive }) =>
              isActive
                ? "sidebar-link-academico active"
                : "sidebar-link-academico"
            }
          >
            <div className="link-academico-b">
              <GrNotes className="icon-academico" />
              <span>Constancias</span>
            </div>
          </NavLink>
        </div>

        <div className="link-academico">
          <NavLink
            to="estadistico"
            className={({ isActive }) =>
              isActive
                ? "sidebar-link-academico active"
                : "sidebar-link-academico"
            }
          >
            <div className="link-academico-b">
              <CiDiscount1 className="icon-academico" />

              <span>Estadístico</span>
            </div>
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
