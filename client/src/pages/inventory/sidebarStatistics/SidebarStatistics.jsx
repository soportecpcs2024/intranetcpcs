import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTh, FaRegChartBar, FaCommentAlt } from "react-icons/fa";
import { BiImageAdd } from "react-icons/bi";
import { HiMenuAlt3 } from "react-icons/hi";
import { RiProductHuntLine } from "react-icons/ri";
import { BsBuildingFillAdd } from "react-icons/bs";
import { RiApps2AddLine } from "react-icons/ri";
import { RiListOrdered2 } from "react-icons/ri";
import { FaListCheck } from "react-icons/fa6";
import { MdAssignmentAdd } from "react-icons/md";

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
          icon={<FaTh />}
          label="Stock"
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
