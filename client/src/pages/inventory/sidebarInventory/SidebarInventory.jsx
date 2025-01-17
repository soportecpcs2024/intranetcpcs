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

import "./SidebarInventory.css";

const SidebarInventory = () => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);
  const location = useLocation();

  return (
    <div className="sidebar" style={{ width: isOpen ? "230px" : "60px" }}>
      <div className="top_section">
        <div className="logo" style={{ display: isOpen ? "block" : "none" }}>
          <RiProductHuntLine size={35} style={{ cursor: "pointer" }} />
        </div>
        <div className="bars" style={{ marginLeft: isOpen ? "100px" : "0px" }}>
          <HiMenuAlt3 onClick={toggle} />
        </div>
      </div>
      <div>
        <div className="pre-title-sidebar">Lista de:</div>
        <SidebarItem
          path="/admin/administracion/productList"
          icon={<FaTh />}
          label="Productos"
          isOpen={isOpen}
          location={location}
        />
        <div>
          <SidebarItem
            path="/admin/administracion/listunit"
            icon={<FaListCheck />}
            label="Unidades Stock"
            isOpen={isOpen}
            location={location}
          />
        </div>
        <div>
          <SidebarItem
            path="/admin/administracion/location_list"
            icon={<RiListOrdered2 />}
            label="Ubicaciones"
            isOpen={isOpen}
            location={location}
          />
        </div>
        <h2 className="SidebarItem-Dashboard-line">_____________________</h2>
        <div className="pre-title-sidebar">Crear :</div>
      </div>

      <SidebarItem
        path="/admin/administracion/add-product"
        icon={<BiImageAdd />}
        label="Productos"
        isOpen={isOpen}
        location={location}
      />
      <SidebarItem
        path="/admin/administracion/createUnits"
        icon={<RiApps2AddLine />}
        label="Unidades"
        isOpen={isOpen}
        location={location}
      />
      <SidebarItem
        path="/admin/administracion/createlocation"
        icon={<BsBuildingFillAdd />}
        label="Ubicaciones"
        isOpen={isOpen}
        location={location}
      />

<div>
        <h2 className="SidebarItem-report-line">_____________________</h2>
        <SidebarItem
          path="/admin/administracion/locationdetails"
          icon={<MdAssignmentAdd />}
          label="Asignaciones"
          isOpen={isOpen}
          location={location}
        />

        
      </div>
      {/* <div>
        <h2 className="SidebarItem-report-line">_____________________</h2>
        <SidebarItem
          path="/admin/administracion/repbug"
          icon={<FaCommentAlt />}
          label="Bug Report"
          isOpen={isOpen}
          location={location}
        />

        
      </div> */}
      
    </div>
  );
};

const SidebarItem = ({ path, icon, label, isOpen, location }) => {
  return (
    <div className="sidebar-item-inventory">
      <Link
        className={`linkNav-inventory ${
          location.pathname === path ? "active-inventory" : ""
        }`}
        to={path}
      >
        <div className="linkNav-inventory-icons">
          {icon}
          {isOpen && <p>{label}</p>}
        </div>
      </Link>
    </div>
  );
};

export default SidebarInventory;
