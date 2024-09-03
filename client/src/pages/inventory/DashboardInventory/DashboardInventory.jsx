import React from "react";
import { Outlet } from "react-router-dom";
import SidebarInventory from "../sidebarInventory/SidebarInventory";
import HeaderInventory from "../headerInventory/HeaderInventory";
import "../dashboard.css";
import FooterInventory from "../footerInventory/FooterInventory";

const DashboardInventory = () => {
  return (
    <div className="dashboard-container-inventory">
      <SidebarInventory />
      <div className="layoutInventory">
        <HeaderInventory />
        <div className="content">
         
          <Outlet />
        </div>
        <FooterInventory />
      </div>
    </div>
  );
};

export default DashboardInventory;
