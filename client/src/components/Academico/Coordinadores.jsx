
import { Outlet, NavLink } from "react-router-dom";

import { FaChildren } from "react-icons/fa6";
import { FaChild } from "react-icons/fa";
import { FaHandsHoldingChild } from "react-icons/fa6";
import { ImManWoman } from "react-icons/im";



const Coordinadores = () => {
 

  return (
    <div className="layout-academico-container">
      <header className="layout-academico-container-division">
        <div className="layout-academico-container-header">
          <div className="link-academico">
            <NavLink
              to="preescolar"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link-academico active"
                  : "sidebar-link-academico"
              }
            >
              <div className="link-recaudo">
                <FaHandsHoldingChild className="icon-academico" />
                <span>Pre Escolar</span>
              </div>
            </NavLink>
          </div>

          <div className="link-academico">
            <NavLink
              to="bprimaria"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link-academico active"
                  : "sidebar-link-academico"
              }
            >
              <div className="link-recaudo">
                <FaChildren className="icon-academico" />
                <span>Básica Primaria</span>
              </div>
            </NavLink>
          </div>

          <div className="link-academico">
            <NavLink
              to="bsecundaria"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link-academico active"
                  : "sidebar-link-academico"
              }
            >
              <div className="link-recaudo">
                <FaChild className="icon-academico" />
                <span>Básica Secundaria</span>
              </div>
            </NavLink>
          </div>

          <div className="link-academico">
            <NavLink
              to="macademica"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link-academico active"
                  : "sidebar-link-academico"
              }
            >
              <div className="link-recaudo">
                <ImManWoman className="icon-academico" />
                <span>Media Académica</span>
              </div>
            </NavLink>
          </div>
        </div>
      </header>

      <main className="content-academico">
        <Outlet />
      </main>
    </div>
  );
};

export default Coordinadores;
