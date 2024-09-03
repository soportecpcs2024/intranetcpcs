import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTh, FaRegChartBar, FaCommentAlt } from "react-icons/fa";
import { BiImageAdd } from "react-icons/bi";
import { HiMenuAlt3 } from "react-icons/hi";
import { RiProductHuntLine } from "react-icons/ri";
import { BsBuildingFillAdd } from "react-icons/bs";
import { RiApps2AddLine } from "react-icons/ri";
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
      <SidebarItem 
        path="/admin/administracion/productList"
        icon={<FaTh />}
        label="Dashboard"
        isOpen={isOpen}
        location={location}
      />
      <SidebarItem
        path="/admin/administracion/add-product"
        icon={<BiImageAdd />}
        label="Add Product"
        isOpen={isOpen}
        location={location}
      />
      <SidebarItem
        path="/admin/administracion/createUnits"
        icon={<RiApps2AddLine />}
        label="Add Units"
        isOpen={isOpen}
        location={location}
      />
      <SidebarItem
        path="/admin/administracion/createlocation"
        icon={<BsBuildingFillAdd />}
        label="Add Location"
        isOpen={isOpen}
        location={location}
      />
      <SidebarItem
        path="/admin/administracion/repbug"
        icon={<FaCommentAlt />}
        label="Bug Report"
        isOpen={isOpen}
        location={location}
      />
       
    </div>
  );
};

const SidebarItem = ({ path, icon, label, isOpen, location }) => {
  return (
    <div className="sidebar-item-inventory">
      <Link
        className={`linkNav-inventory ${
          location.pathname === path ? "active" : ""
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

