import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "/logo2025.png";
import { useAuth } from "../../contexts/AuthContext";
import { NavLink } from "react-router-dom";

const AdminHeader = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [activo, setActivo] = useState(false);

  const handleClick = () => {
    setActivo(true);
  };

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
  const secretaria = user && user.role === "secretaria"; // Verificar si el usuario tiene el rol de teacher
  const tesoreria = user && user.role === "tesoreria"; // Verificar si el usuario tiene el rol de teacher
  const escuelaPadres = user && user.role === "escuelaPadres"; // Verificar si el usuario tiene el rol de teacher
  const mantenimiento = user && user.role === "mantenimiento"; // Verificar si el usuario tiene el rol de teacher

  return (
    <div className="admin-header">
      <div className="admin-layout-header">
        <div className="admin-layout-header-slogan">
          <div className="admin-layout-header-logo-pre">
            <img
              className="admin-layout-header-logo"
              src={Logo}
              alt="Logo CPCS"
            />
          </div>
          <div className="admin-layout-header-text">
            <p>
              <span className="admin-layout-header-text-span">
                COLEGIO PANAMERICANO COLOMBO SUECO
              </span>
            </p>
          </div>
        </div>
          <button className="cerrar" onClick={handleLogout}>
                      Cerrar{" "}
                    </button>

        <div className="admin-layout-header-links-pre">
          <div>
            <nav>
              {isAdmin && (
                <ul>
                  <li>
                    <Link to="/admin/users">Inicio</Link>
                  </li>

                  <li>
                    <div >
                      <Link onClick={toggleDropdown}>Académico</Link>
                      {isDropdownOpen && (
                        <ul className="dropdown-menu">
                          <li>
                            <Link to="/admin/academico">Reporte académico</Link>
                          </li>
                          <li>
                            <Link to="/admin/documentos">
                              Promedios por materia
                            </Link>
                          </li>
                          <li>
                            <Link to="/admin/llegadastarde">
                              Llegadas tarde
                            </Link>
                          </li>
                          <li>
                            <Link to="/admin/infoacademico">
                              Informes Académicos
                            </Link>
                          </li>
                        </ul>
                      )}
                    </div>
                  </li>

                  <li>
                    <div className="dropdown">
                      <Link onClick={toggleDropdown}>Administración</Link>

                      {isDropdownOpen && (
                        <ul className="dropdown-menu">
                          <li>
                            <Link to="/admin/administracion">Stock</Link>
                          </li>
                          <li>
                            <Link to="/admin/inventario_estadisticas">
                              Informes
                            </Link>
                          </li>
                        </ul>
                      )}
                    </div>
                  </li>

                  <li>
                    <div className="dropdown">
                      <Link to="tesoreria">Recaudo</Link>
                    </div>
                  </li>

                  {/* <div  >
                    <li>
                      <Link to="/admin/soporte">Adm Soporte</Link>
                    </li>
                  </div> */}

                  <li>
                    <Link to="esc_padres">E.Padres</Link>
                  </li>

                  <li>
                    <Link to="programadorTareas">Mantenimineto</Link>
                  </li>

                  <li>
                  </li>
                </ul>
              )}
                  

              {isAcademic && (
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
                            <Link to="/admin/llegadastarde">
                              Llegadas tarde
                            </Link>
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
                  <li>
                    <button className="logout-button" onClick={handleLogout}>
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              )}
              {secretaria && (
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
                            <Link to="/admin/documentos">Documentos</Link>
                          </li>

                          <li>
                            <Link to="/admin/infoacademico">
                              Informes Académicos
                            </Link>
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
                  <li>
                    <button className="logout-button" onClick={handleLogout}>
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              )}
              {tesoreria && (
                <ul>
                  <li>
                    <Link to="/admin/users">Inicio</Link>
                  </li>
                  {/* <li>
              <Link to="/admin/blog">Blog</Link>
              </li> */}
                  <li>
                    <div className="dropdown">
                      <Link onClick={toggleDropdown}>Tesoreria</Link>
                      {isDropdownOpen && (
                        <ul className="dropdown-menu">
                          <li>
                            <Link to="tesoreria">Recaudos</Link>
                          </li>
                          <li>
                            <Link to="tesoreria">Cartera </Link>
                          </li>
                          <li>
                            <Link to="informerecaudo">Informe de recaudo</Link>
                          </li>
                          <li>
                            <Link to="informerecaudo">Informe de cartera</Link>
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
                  <li>
                    <button className="logout-button" onClick={handleLogout}>
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              )}
              {escuelaPadres && (
                <ul>
                  <li>
                    <Link to="/admin/users">Inicio</Link>
                  </li>
                  {/* <li>
              <Link to="/admin/blog">Blog</Link>
              </li> */}
                  <li>
                    <div className="dropdown">
                      <Link onClick={toggleDropdown}>Escuela de Padres</Link>
                      {isDropdownOpen && (
                        <ul className="dropdown-menu">
                          <li>
                            <Link to="tesoreria">Recaudos</Link>
                          </li>
                          <li>
                            <Link to="tesoreria">Cartera </Link>
                          </li>
                          <li>
                            <Link to="informerecaudo">Informe de recaudo</Link>
                          </li>
                          <li>
                            <Link to="informerecaudo">Informe de cartera</Link>
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
                  <li>
                    <button className="logout-button" onClick={handleLogout}>
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              )}
              {isAdministrator && (
                <ul>
                  <li>
                    <Link to="/admin/users">Inicio</Link>
                  </li>
                  {/* <li>
              <Link to="/admin/blog">Blog</Link>
              </li> */}

                  <div className="admin-layout-header-links-a">
                    <li>
                      <div className="dropdown">
                        <Link onClick={toggleDropdown}>Administración</Link>

                        {isDropdownOpen && (
                          <ul className="dropdown-menu">
                            <li>
                              <Link to="/admin/administracion">Stock</Link>
                            </li>
                            <li>
                              <Link to="/admin/inventario_estadisticas">
                                Informes
                              </Link>
                            </li>
                          </ul>
                        )}
                      </div>
                    </li>
                  </div>

                  <li>
                    <Link
                      to="https://site2.q10.com/login?ReturnUrl=%2F&aplentId=d12efeb8-f609-4dd1-87cd-1cb0c95d32e2"
                      target="_blank"
                    >
                      Q 10
                    </Link>
                  </li>

                  <li>
                    <button className="logout-button" onClick={handleLogout}>
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              )}
              {mantenimiento && (
                <div className="cerrar-cession-tarea">
                  <div>
                    <Link
                      className={`cerrar-cession-tarea-hover ${
                        activo ? "activo" : ""
                      }`}
                      to="programadorTareas"
                      onClick={handleClick}
                    >
                      Tareas CPCS
                    </Link>
                  </div>
                  <div>
                    <button onClick={handleLogout}>Cerrar sesión</button>
                  </div>
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
