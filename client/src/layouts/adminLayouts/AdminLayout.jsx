 
import { Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";
 
 


const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminHeader />
      <div className="content-container">
        <Outlet />
      </div>
      
    </div>
  );
};

export default AdminLayout;

