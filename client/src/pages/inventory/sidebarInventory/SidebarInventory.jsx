import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaTh, FaRegChartBar, FaCommentAlt } from "react-icons/fa";
import { BiImageAdd } from "react-icons/bi";
import { HiMenuAlt3 } from "react-icons/hi";
import { RiProductHuntLine } from "react-icons/ri";
import "./SidebarInventory.css"; // Asume que moviste el CSS aquí

const SidebarInventory = () => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);

  const menu = [
    {
      title: "Dashboard",
      icon: <FaTh />,
      path: "/admin/administracion/productList",
    },
    {
      title: "Add Product",
      icon: <BiImageAdd />,
      path: "/admin/administracion/add-product",
    },
    {
      title: "Account",
      icon: <FaRegChartBar />,
      children: [
        {
          title: "Profile",
          path: "/profile",
        },
        {
          title: "Edit Profile",
          path: "/edit-profile",
        },
      ],
    },
    {
      title: "Report Bug",
      icon: <FaCommentAlt />,
      path: "/contact-us",
    },
  ];

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
      {menu.map((item, index) => (
        <SidebarItem key={index} item={item} isOpen={isOpen} />
      ))}
    </div>
  );
};

const SidebarItem = ({ item, isOpen }) => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);

  return (
    <div className={`sidebar-item ${open ? "open" : ""}`}>
      
      <div className="sidebar-title" onClick={item.children ? toggle : null}>
        <span>
          <div className="icon">{item.icon}</div>
          {isOpen && item.children ? (
            <>
              {item.title}
              <div className="arrow-icon">{open ? "▼" : "▶"}</div>
            </>
          ) : (
            <Link to={item.path} className="sublink">
              {item.title}
            </Link>
          )}
        </span>
      </div>
      {item.children && open && (
        <div className="sidebar-content">
          {item.children.map((child, index) => (
            <Link to={child.path} key={index} className="sublink">
              {child.title}
            </Link>
          ))}
          
        </div>
      )}
    </div>
  );
};

export default SidebarInventory;
