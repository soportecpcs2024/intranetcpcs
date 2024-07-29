import React from 'react';
import { Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import Footer from "../../pages/admin/User/footer/Footer";
 


const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminHeader />
      <div className="content-container">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;

