import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import Footer from "../../../pages/admin/User/footer/Footer";
import { PiCertificateDuotone } from "react-icons/pi";
import { GrNotes } from "react-icons/gr";
import { CiDiscount1 } from "react-icons/ci";
import { GrCertificate } from "react-icons/gr";
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
              <span>Certificados de estudio</span>
            </div>
          </NavLink>
        </div>

        <div className="link-academico">
          <NavLink
            to="actas_grados"
            className={({ isActive }) =>
              isActive
                ? "sidebar-link-academico active"
                : "sidebar-link-academico"
            }
          >
            <div className="link-academico-b">
              <GrCertificate className="icon-academico" />

              <span>Actas de Grado</span>
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
