import { Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";


const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <div>
        <AdminHeader />
        
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
