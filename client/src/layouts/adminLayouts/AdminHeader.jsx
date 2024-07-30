import React, { useState } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import Logo from "/logo.png";
import { useAuth } from "../../contexts/AuthContext";

const AdminHeader = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout(); // Llama a la función de logout del contexto de autenticación
    navigate("/"); // Redirige al usuario a la página de inicio ('/')
  };

  const isAdmin = user && user.role === "admin"; // Verificar si el usuario tiene el rol de admin
  const isAcademic = user && user.role === "usuario"; // Verificar si el usuario tiene el rol de admin
  const isAdministrator = user && user.role === "administrador"; // Verificar si el usuario tiene el rol de teacher
  


  return (
    <div className="admin-header">
      <div className="admin-layout-header">
        <img className="admin-layout-header-logo" src={Logo} alt="Logo CPCS" />
        <div className="admin-layout-header-text">
          <p>
            <span className="admin-layout-header-text-span">
              Celebrando 30 años
            </span>
          </p>
        </div>

        <nav>
          {isAdmin && (
            <ul>
              <li>
                <Link to="/admin/users">Inicio</Link>
              </li>
              {/* <li>
                <Link to="/admin/blog">Blog</Link>
              </li> */}
              <li>
                <div className="dropdown">
                  <Link onClick={toggleDropdown}>Académico</Link>
                  {isDropdownOpen && (
                    <ul className="dropdown-menu">
                      <li>
                        <Link to="/admin/academico">Reporte académico</Link>
                      </li>
                      <li>
                        <Link to="/admin/documentos">Documentos</Link>
                      </li>
                      <li>
                        <Link to="/admin/llegadastarde">Llegadas tarde</Link>
                      </li>
                    </ul>
                  )}
                </div>
              </li>
              <li>
                <Link to="/admin/administracion">Administración</Link>
              </li>
              <li>
                <Link to="/admin/soporte">Admin Soporte</Link>
              </li>
              <li>
                <Link
                  to="https://site2.q10.com/login?ReturnUrl=%2F&aplentId=d12efeb8-f609-4dd1-87cd-1cb0c95d32e2"
                  target="_blank"
                >
                  Q 10
                </Link>
              </li>
            </ul>
          )}{ isAcademic && (
            <ul>
            <li>
              <Link to="/admin/users">Inicio</Link>
            </li>
            {/* <li>
              <Link to="/admin/blog">Blog</Link>
            </li> */}
            <li>
            <div className="dropdown">
                  <Link onClick={toggleDropdown}>Académico</Link>
                  {isDropdownOpen && (
                    <ul className="dropdown-menu">
                      <li>
                        <Link to="/admin/academico">Reporte académico</Link>
                      </li>
                      <li>
                        <Link to="/admin/documentos">Documentos</Link>
                      </li>
                      <li>
                        <Link to="/admin/llegadastarde">Llegadas tarde</Link>
                      </li>
                    </ul>
                  )}
                </div>
            </li>
            
            <li>
              <Link
                to="https://site2.q10.com/login?ReturnUrl=%2F&aplentId=d12efeb8-f609-4dd1-87cd-1cb0c95d32e2"
                target="_blank"
              >
                Q 10
              </Link>
            </li>
          </ul>
          )} {isAdministrator && 
            <ul>
            <li>
              <Link to="/admin/users">Inicio</Link>
            </li>
            {/* <li>
              <Link to="/admin/blog">Blog</Link>
            </li> */}
             
            <li>
              <Link to="/admin/administracion">Administración</Link>
            </li>
            <li>
              <Link
                to="https://site2.q10.com/login?ReturnUrl=%2F&aplentId=d12efeb8-f609-4dd1-87cd-1cb0c95d32e2"
                target="_blank"
              >
                Q 10
              </Link>
            </li>
          </ul>
          }
        </nav>
        <button className="logout-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;

