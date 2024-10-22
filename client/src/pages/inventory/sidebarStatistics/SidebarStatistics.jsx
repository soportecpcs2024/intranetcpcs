import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTh, FaRegChartBar, FaCommentAlt } from "react-icons/fa";
 
import { HiMenuAlt3 } from "react-icons/hi";
import { RiProductHuntLine } from "react-icons/ri";
import { MdCategory } from "react-icons/md";
import { AiOutlineDeploymentUnit } from "react-icons/ai";
import "./SidebarStatistics.css";

const SidebarScatistics = () => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);
  const location = useLocation();

  return (
    <div
      className="sidebar-statis"
      style={{ width: isOpen ? "230px" : "60px" }}
    >
      <div className="top_section-statis">
        <div
          className="logo-statis"
          style={{ display: isOpen ? "block" : "none" }}
        >
          <RiProductHuntLine size={35} style={{ cursor: "pointer" }} />
        </div>
        <div
          className="bars-statis"
          style={{ marginLeft: isOpen ? "100px" : "0px" }}
        >
          <HiMenuAlt3 onClick={toggle} />
        </div>
      </div>
      <div>
        <div className="pre-title-sidebar-statis">Lista de:</div>
        <SidebarItem
          path="/admin/inventario_estadisticas/infostock"
          icon={<MdCategory />}
          label="Categorias"
          isOpen={isOpen}
          location={location}
        />
        <SidebarItem
          path="/admin/inventario_estadisticas/subcategory"
          icon={<AiOutlineDeploymentUnit />}
          label="Sub ategorias"
          isOpen={isOpen}
          location={location}
        />
         
        <h2 className="SidebarItem-Dashboard-line">_____________________</h2>
        <div className="pre-title-sidebar-statis">Crear :</div>
      </div>

      
      

       
    </div>
  );
};

const SidebarItem = ({ path, icon, label, isOpen, location }) => {
  return (
    <div className="sidebar-item-inventory-statis">
      <Link
        className={`linkNav-inventory-statis ${
          location.pathname === path ? "active-inventory-statis" : ""
        }`}
        to={path}
      >
        <div className="linkNav-inventory-icons-statis">
          {icon}
          {isOpen && <p>{label}</p>}
        </div>
      </Link>
    </div>
  );
};

export default SidebarScatistics;
