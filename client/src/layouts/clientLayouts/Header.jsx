import React from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import Logo from "/logo.png";
const Header = () => {
  const navigate = useNavigate();

  const handleAdminRedirect = () => {
    navigate("/admin"); // Redirige a la ruta /admin
  };
  return (
    <header className="header-client">
      
        <img className="header-logo" src={Logo} alt="Logo CPCS" />
     
      <div className="header-enlaces">
        <nav className="nav-client">
          <Link to="/">Home</Link>
          <Link to="/colegio">Colegio</Link>
          <Link to="/contactos">Contactos</Link>
          <Link to="/q10web">Q10 Colombia</Link>
          <Link to="/admin">IntranetCPCS</Link>
        </nav>
      </div>

      <div className="header-icons">
        {/* <button className="admin-redirect-button" onClick={handleAdminRedirect}>
          Ir a Admin
        </button> */}
        <GiHamburgerMenu />
      </div>
      <div className="admin-layout-header-text">
          <h1>Colegio Panamericano Colombo Sueco</h1>
          <p><span className="admin-layout-header-text-span">30 AÑOS</span>formando líderes en Cristo para Colombia y las naciones</p>
        </div>
    </header>
  );
};

export default Header;
