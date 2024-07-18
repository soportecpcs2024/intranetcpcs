import { Outlet, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
 

const ClientLayouts = () => {
  const navigate = useNavigate();
   
   

  const handleAdminRedirect = () => {
    navigate('/admin'); // Redirige a la ruta /admin
  };

  return (
    <div className="web-layout">
      
      <Header />
     
      <Outlet />
      <Footer />
    </div>
  );
};

export default ClientLayouts;

