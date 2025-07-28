import { Outlet, NavLink } from "react-router-dom";

import { SiGoogleclassroom } from "react-icons/si";
import { SiMdbook } from "react-icons/si";
import { LiaWpforms } from "react-icons/lia";
import { GiLovers } from "react-icons/gi";
 
import * as XLSX from "xlsx";
import { useRecaudo } from "../../contexts/RecaudoContext"; // Asegúrate de importar el contexto correcto

import { GiMeal } from "react-icons/gi";

import "./Admisiones.css";
import Footer from "../../pages/admin/User/footer/Footer";

const LayoutAdmisiones = () => {
  const { facturas } = useRecaudo(); // Obtiene las facturas desde el contexto

  

  return (
    <div className="layout-academico-container">
      <header className="layout-academico-container-division">
        <div className="layout-academico-container-header">
          

          
          <div className="link-academico">
            <NavLink
              to="formulario_inscripcion"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link-academico active"
                  : "sidebar-link-academico"
              }
            >
              <div className="link-recaudo">
                <LiaWpforms className="icon-academico" />
                <span>Formularios</span>
              </div>
            </NavLink>
          </div>

     
        </div>

       
      </header>

      <main className="content-academico">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default LayoutAdmisiones;