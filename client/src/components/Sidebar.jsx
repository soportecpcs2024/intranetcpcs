import React from "react";
import { Link, useLocation } from "react-router-dom";
import { PiUsersThreeBold } from "react-icons/pi";
import { FaSchool } from "react-icons/fa";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { TbStairsDown } from "react-icons/tb";
import { SiLeaderprice } from "react-icons/si";

const Sidebar = () => {
  const location = useLocation();

  return (
    <>
      <h2 className="sidebarH2">INFORMES</h2>
      <nav className="containerNav">
        <div className="containerNav-link-container">
          <Link
            className={`linkNav ${
              location.pathname === "/admin/academico/general" ? "active" : ""
            }`}
            to="/admin/academico/general"
          >
            <FaSchool className="icons" />
            <div>
              <p>Estadística general</p>
            </div>
          </Link>
        </div>
        <Link
          className={`linkNav ${
            location.pathname === "/admin/academico/areas" ? "active" : ""
          }`}
          to="/admin/academico/areas"
        >
          <PiUsersThreeBold className="icons" />
          <div>
            <p>Estadística por área</p>
          </div>
        </Link>


        <Link
          className={`linkNav ${
            location.pathname === "/admin/academico/individual" ? "active" : ""
          }`}
          to="/admin/academico/individual"
        >
          <BsFillPersonVcardFill className="icons" />
          <div>
            <p>Estadística individual</p>
          </div>
        </Link>

        <Link
          className={`linkNav ${
            location.pathname === "/admin/academico/quinto_informe" ? "active" : ""
          }`}
          to="/admin/academico/quinto_informe"
        >
          <BsFillPersonVcardFill className="icons" />
          <div>
            <p>5° Informe académico</p>
          </div>
        </Link>
        <div className="linkNav-espacio-p">
          <p>_______________</p>
        </div>

        <Link
          className={`linkNav ${
            location.pathname === "/admin/academico/coordinadores" ? "active" : ""
          }`}
          to="/admin/academico/coordinadores"
        >
          <SiLeaderprice className="icons" />
          <div>
            <p>Otra cosa</p>
          </div>
        </Link>
        
        <div className="linkNav-espacio-p">
          <p>_______________</p>
        </div>
        <Link
          className={`linkNav ${
            location.pathname === "/admin/academico/nivelSuperior" ? "active" : ""
          }`}
          to="/admin/academico/nivelSuperior"
        >
          <PiUsersThreeBold className="icons" />
          <div>
            <p>Niveles superiores</p>
          </div>
        </Link>
        
         
      </nav>
    </>
  );
};

export default Sidebar;
