
import { Link, useLocation } from "react-router-dom";
import { FaBoxOpen } from "react-icons/fa";

import "./SidebarPapeleria.css";

const SidebarPapeleria = () => {
  const location = useLocation();

  return (
    <>

      <nav className="containerNav">

        <Link
          className={`linkNavPapeleria ${location.pathname === "/admin/papeleria/registrarProductos" ? "active" : ""
            }`}
          to="/admin/papeleria/registrarProductos"
        >
          

            <FaBoxOpen className="icons" />
            <p>Ingresar Productos</p>
          
        </Link>

        <Link
          className={`linkNavPapeleria ${location.pathname === "/admin/papeleria/solicitarProductos" ? "active" : ""
            }`}
          to="/admin/papeleria/solicitarProductos"
        >
          

            <FaBoxOpen className="icons" />
            <p>Solicitar productos</p>
          
        </Link>


        {/* <div className="linkNav-espacio-p">
          <p>_______________</p>
        </div>
  */}


      </nav>
    </>
  );
};

export default SidebarPapeleria;
