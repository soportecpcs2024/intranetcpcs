import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import Footer from "../../../pages/admin/User/footer/Footer";
import { PiCertificateDuotone } from "react-icons/pi";
import { SiGoogleclassroom } from "react-icons/si";
import { GrNotes } from "react-icons/gr";
import { CiDiscount1 } from "react-icons/ci";
import { SiMdbook } from "react-icons/si";
import { LiaWpforms } from "react-icons/lia";
import { GiLovers } from "react-icons/gi";
import ".//LayoutTesoreria.css";

const LayoutTesoreria
 = () => {
  return (
    <div className="layout-academico-container">
      <header className="layout-academico-container-header">
        <div className="link-recaudo">
          <SiGoogleclassroom className="icon-academico" />
          <NavLink
            to="recaudo"
            className={({ isActive }) =>
              isActive ? "sidebar-link-academico active" : "sidebar-link-academico"
            }
          >
            <span>Extra Clases</span>
          </NavLink>
        </div>

        <div className="link-recaudo">
          <SiMdbook className="icon-academico" />
          <NavLink
            to="antologia"
            className={({ isActive }) =>
              isActive ? "sidebar-link-academico active" : "sidebar-link-academico"
            }
          >
            <span>Antología</span>
          </NavLink>
        </div>


        <div className="link-recaudo">
          <GiLovers className="icon-academico" />
          <NavLink
            to="escuela_padres"
            className={({ isActive }) =>
              isActive ? "sidebar-link-academico active" : "sidebar-link-academico"
            }
          >
            <span>Escuela de Padres</span>
          </NavLink>
        </div>


        <div className="link-academico">
          <LiaWpforms className="icon-academico" />
          <NavLink
            to="formulario_inscripcion"
            className={({ isActive }) =>
              isActive ? "sidebar-link-academico active" : "sidebar-link-academico"
            }
          >
            <span>Formularios</span>
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

export default LayoutTesoreria
;
