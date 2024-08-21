import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTh, FaRegChartBar, FaCommentAlt } from "react-icons/fa";
import { BiImageAdd } from "react-icons/bi";
import { HiMenuAlt3 } from "react-icons/hi";
import { RiProductHuntLine } from "react-icons/ri";
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
        path="/admin/administracion/report-bug"
        icon={<FaCommentAlt />}
        label="Report Bug"
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

// const menu = [
//   {
//     title: "Dashboard",
//     icon: <FaTh />,
//     path: "/admin/administracion/productList",
//   },
//   {
//     title: "Add Product",
//     icon: <BiImageAdd />,
//     path: "/admin/administracion/add-product",
//   },
//   {
//     title: "assign product",
//     icon: <BiImageAdd />,
//     path: "/admin/administracion/assign-product",
//   },
//   {
//     title: "Crear nuevo...",
//     icon: <FaRegChartBar />,
//     children: [
//       {
//         title: "Producto",
//         path: "/profile",
//       },
//       {
//         title: "Unidad",
//         path: "/edit-profile",
//       },
//       {
//         title: "Locacion",
//         path: "/edit-profile",
//       },
//     ],
//   },
//   {
//     title: "Report Bug",
//     icon: <FaCommentAlt />,
//     path: "/contact-us",
//   },
// ];
