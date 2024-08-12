import { Outlet, useNavigate } from "react-router-dom";
import FooterInventory from "../footerInventory/FooterInventory";
import HeaderInventory from "../headerInventory/HeaderInventory";

const LayoutInventory = () => {
  return (
    <div>
      <HeaderInventory />
     <Outlet />
      <FooterInventory />
    </div>
  );
};

export default LayoutInventory;
