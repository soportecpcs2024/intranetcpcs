import { Outlet } from "react-router-dom";
 
import HeaderInventory from '../../../../pages/inventory/headerInventory/HeaderInventory'
import FooterInventory from '../../../../pages/inventory/footerInventory/FooterInventory'
import SidebarScatistics from "../../../../pages/inventory/sidebarStatistics/SidebarStatistics";


const DashboardStatistics = () => {
  return (
    <div className="dashboard-container-inventory">
      <SidebarScatistics />
      <div className="layoutInventory">
        <HeaderInventory />
        <div className="content">
         
          <Outlet />
        </div>
        <FooterInventory />
      </div>
    </div>
  )
}

export default DashboardStatistics
