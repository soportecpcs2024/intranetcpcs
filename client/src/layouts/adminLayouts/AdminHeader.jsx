import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "/logo2025.png";
import { useAuth } from "../../contexts/AuthContext";
import { useRecaudo } from "../../contexts/RecaudoContext"
import { useEscuelaPadres } from "../../contexts/EscuelaPadresContext";


const AdminHeader = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { descargarVentasMensualesJSON } = useRecaudo();
  const { descargarAsistenciasJSON } = useEscuelaPadres();




  const toggleDropdown = (nombreDropdown) => {
    setActiveDropdown((actual) =>
      actual === nombreDropdown ? null : nombreDropdown
    );
  };
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((estadoActual) => !estadoActual);
  };

  const handleNavigationClick = (event) => {
    const enlace = event.target.closest("a");

    if (!enlace) {
      return;
    }

    // Si es el título de un dropdown, permite abrirlo sin cerrar el menú
    const esTituloDropdown =
      enlace.parentElement?.classList.contains("dropdown");

    if (esTituloDropdown) {
      return;
    }

    // Si es un enlace interno, cierra el menú móvil
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout(); // Llama a la función de logout del contexto de autenticación
    navigate("/"); // Redirige al usuario a la página de inicio ('/')
  };

  const isAdmin = user && user.role === "admin"; // Verificar si el usuario tiene el rol de admin
  const isAcademic = user && user.role === "usuario"; // Verificar si el usuario tiene el rol de admin
  const isAdministrator = user && user.role === "administrador";
  const secretaria = user && user.role === "secretaria";
  const tesoreria = user && user.role === "tesoreria";
  const escuelaPadres = user && user.role === "escuelaPadres";
  const mantenimiento = user && user.role === "mantenimiento";
  //const admisiones = user && user.role === "admisiones"; 

  const contabilidad = user && user.role === "contabilidad";
  const administrativos = user && user.role === "administrativos";
  const directivas = user && user.role === "directivas";
  const familiafinke = user && user.role === "familiafinke";

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

         
        <button
          type="button"
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label="Abrir o cerrar menú"
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>

       

        <div
          className={`admin-layout-header-links-pre ${isMobileMenuOpen ? "mobile-menu-open" : ""
            }`}
        >
          <div>
            <nav onClick={handleNavigationClick}>
              {isAdmin && (
                <ul>
                  <li>
                    <div className="dropdown">
                      <Link onClick={() => toggleDropdown("academico")}>Académico</Link>

                      {activeDropdown === "academico" && (
                        <ul className="dropdown-menu">
                          <li>
                            <Link to="/admin/academico">Reporte académico</Link>
                          </li>
                          <li>
                            <Link to="/admin/documentos">Estadística KPI</Link>
                          </li>
                          <li>
                            <Link to="/admin/llegadastarde">
                              Llegadas tarde
                            </Link>
                          </li>
                          <li>
                            <Link to="/admin/extraclases">
                              Extra curricular
                            </Link>
                          </li>
                          <h5><em>Plan de mejoramiento:</em></h5>
                          <li>
                            <Link to="control_semanal">Control semanal</Link>
                          </li>
                          <li>
                            <Link to="checkupDashboard">Seguimiento</Link>
                          </li>
                          <li>
                            <Link to="listarRegistroscheckup">Lista de Registros</Link>
                          </li>
                          <li>
                            <Link to="/">- - - - - - </Link>
                          </li>
                          <li>
                            <Link to="tomaAsistenciaGrupo">Toma Asistencia</Link>
                          </li>
                        </ul>
                      )}
                    </div>
                  </li>

                  <li>
                    <div className="dropdown">
                      <Link onClick={() => toggleDropdown("administracion")}>Adm</Link>

                      {activeDropdown === "administracion" && (
                        <ul className="dropdown-menu">
                          <li>
                            <Link to="/admin/administracion">Stock</Link>
                          </li>
                          <li>
                            <Link to="/admin/inventario_estadisticas">
                              Estadisticas Inventario
                            </Link>
                          </li>
                          <li>
                            <Link to="/admin/informesgenerales">
                              Informes de Tareas
                            </Link>
                          </li>
                          <li>
                            <Link to="seguimientoMantenimiento">
                              Seguimiento mantenimientos
                            </Link>
                          </li>
                          <li>
                            <Link to="informesExtraClasesDec">
                              Informe Extraclases
                            </Link>
                          </li>
                          {/* <li>
                            <Link to="registroAsistencia">
                              Asistencia Extraclases
                            </Link>
                          </li> */}
                        </ul>
                      )}
                    </div>
                  </li>

                  <li>
                    <div className="dropdown">
                      <Link onClick={() => toggleDropdown("tesoreria")}>Tesorería</Link>


                      {activeDropdown === "tesoreria" && (
                        <ul className="dropdown-menu">
                          <li>
                            <Link to="tesoreria">Recaudo</Link>
                          </li>
                          {/* <li>
                            <Link to="morosos_penciones">Morosos Penciones</Link>
                          </li> */}


                        </ul>
                      )}
                    </div>
                  </li>

                  <li>
                    <div className="dropdown">
                      <Link onClick={() => toggleDropdown("escuelaPadres")}>E. Padres</Link>

                      {activeDropdown === "escuelaPadres" && (
                        <ul className="dropdown-menu">
                          <li>
                            <Link to="esc_padres">Registro Asistencia</Link>
                          </li>
                          <li>
                            <Link to="estadisticas_ep">Estadisticas EP</Link>
                          </li>
                          <li>
                            <Link to="crear_ep">Crear Escuela</Link>
                          </li>
                          <li>
                            <Link to="eppagas">Pagos escuelas</Link>
                          </li>
                          <li>
                            <Link to="informe_escuela_padres">
                              Informe pagos EP
                            </Link>
                          </li>
                          <li>
                            <Link to="historico_ep">
                              Historico
                            </Link>
                          </li>
                        </ul>
                      )}
                    </div>
                  </li>

                  <li>
                    <div className="dropdown">
                      <Link onClick={() => toggleDropdown("tareas")}>
                        Tareas y mantenimientos
                      </Link>
                      {activeDropdown === "tareas" && (
                        <ul className="dropdown-menu">
                          <li>
                            <Link to="programadorTareas">Tareas</Link>
                          </li>

                          <li>
                            <Link to="crearMantenimiento">
                              Crear mantenimiento
                            </Link>
                          </li>
                        </ul>
                      )}
                    </div>
                  </li>

                  <li>
                    <div className="dropdown">
                      <Link onClick={() => toggleDropdown("secretaria")}>Sec.Académica</Link>
                      {activeDropdown === "secretaria" && (
                        <ul className="dropdown-menu">
                          <li>
                            <Link to="/admin/documentos">Estadística KPI</Link>
                          </li>

                          <li>
                            <Link to="/admin/infoacademico">
                              Informes Académicos
                            </Link>
                          </li>
                          <li>
                            <Link to="registropei">
                              Registro PEI
                            </Link>
                          </li>
                        </ul>
                      )}
                    </div>
                  </li>

                  <li>
                    <div className="dropdown">
                      <Link onClick={() => toggleDropdown("contabilidad")}>Contabilidad</Link>

                      {activeDropdown === "contabilidad" && (
                        <ul className="dropdown-menu">
                          <li>
                            <Link to="cargar_archivo">Cargar Archivo</Link>
                          </li>
                          <li>
                            <Link to="descargar_colilla">
                              Descargar colilla
                            </Link>
                          </li>
                          <li>
                            <Link to="eliminar_colillas">
                              Eliminar colillas
                            </Link>
                          </li>



                        </ul>
                      )}
                    </div>
                  </li>

                  <li>
                    <div className="dropdown">
                      <Link onClick={() => toggleDropdown("backup")}>Backup</Link>

                      {activeDropdown === "backup" && (
                        <ul className="dropdown-menu">

                          <li>
                            <button
                              type="button"
                              onClick={descargarVentasMensualesJSON}
                              style={{
                                background: "none",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                                color: "inherit",
                                font: "inherit",
                              }}
                            >
                              Descargar ventas JSON
                            </button>
                          </li>

                          <li>
                            <button
                              type="button"
                              onClick={descargarAsistenciasJSON}
                              style={{
                                background: "none",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                                color: "inherit",
                                font: "inherit",
                              }}
                            >
                              Descargar asistencias JSON
                            </button>
                          </li>


                        </ul>
                      )}
                    </div>
                  </li>


                </ul>
              )}

              {familiafinke && (
                <ul>
                  <li>
                    <div className="dropdown">
                      <Link onClick={() => toggleDropdown("academico")}>Académico</Link>
                      {activeDropdown === "academico" && (
                        <ul className="dropdown-menu">
                          <li>
                            <Link to="/admin/academico">Reporte académico</Link>
                          </li>
                          <li>
                            <Link to="/admin/documentos">Estadística KPI</Link>
                          </li>
                          <li>
                            <Link to="/admin/llegadastarde">
                              Llegadas tarde
                            </Link>
                          </li>
                          <li>
                            <Link to="/admin/extraclases">
                              Extra curricular
                            </Link>
                          </li>
                          <h5><em>Plan de mejoramiento:</em></h5>
                          <li>
                            <Link to="control_semanal">Control semanal</Link>
                          </li>
                          <li>
                            <Link to="checkupDashboard">Seguimiento</Link>
                          </li>
                          <li>
                            <Link to="listarRegistroscheckup">Lista de Registros</Link>
                          </li>
                        </ul>
                      )}
                    </div>
                  </li>

                  <li>
                    <div className="dropdown">
                      <Link onClick={() => toggleDropdown("administracion")}>Adm</Link>

                      {activeDropdown === "administracion" && (
                        <ul className="dropdown-menu">
                          <li>
                            <Link to="/admin/administracion">Stock</Link>
                          </li>
                          {/* <li>
                            <Link to="/admin/inventario_estadisticas">
                              Estadisticas Inventario
                            </Link>
                          </li> */}
                          <li>
                            <Link to="/admin/informesgenerales">
                              Informes de Tareas
                            </Link>
                          </li>
                          <li>
                            <Link to="seguimientoMantenimiento">
                              Seguimiento mantenimientos
                            </Link>
                          </li>
                          <li>
                            <Link to="informesExtraClasesDec">
                              Informe Extraclases
                            </Link>
                          </li>
                          {/* <li>
                            <Link to="registroAsistencia">
                              Asistencia Extraclases
                            </Link>
                          </li> */}
                        </ul>
                      )}
                    </div>
                  </li>

                  <li>
                    <div className="dropdown">
                      <Link onClick={() => toggleDropdown("tesoreria")}>Tesorería</Link>


                      {activeDropdown === "tesoreria" && (
                        <ul className="dropdown-menu">
                          <li>
                            <Link to="tesoreria">Recaudo</Link>
                          </li>
                          {/* <li>
                            <Link to="morosos_penciones">Morosos Penciones</Link>
                          </li> */}


                        </ul>
                      )}
                    </div>
                  </li>

                  <li>
                    <div className="dropdown">
                      <Link onClick={() => toggleDropdown("escuelaPadres")}>E. Padres</Link>

                      {activeDropdown === "escuelaPadres" && (
                        <ul className="dropdown-menu">
                          <li>
                            <Link to="esc_padres">Registro Asistencia</Link>
                          </li>
                          <li>
                            <Link to="estadisticas_ep">Estadisticas EP</Link>
                          </li>
                          <li>
                            <Link to="crear_ep">Crear Escuela</Link>
                          </li>
                          <li>
                            <Link to="eppagas">Pagos escuelas</Link>
                          </li>
                          <li>
                            <Link to="informe_escuela_padres">
                              Informe pagos EP
                            </Link>
                          </li>
                          <li>
                            <Link to="historico_ep">
                              Historico
                            </Link>
                          </li>
                        </ul>
                      )}
                    </div>
                  </li>

                  <li>
                    <div className="dropdown">
                      <Link onClick={() => toggleDropdown("tareas")}>
                        Tareas y mantenimientos
                      </Link>
                      {activeDropdown === "tareas" && (
                        <ul className="dropdown-menu">
                          <li>
                            <Link to="programadorTareas">Tareas</Link>
                          </li>

                          <li>
                            <Link to="crearMantenimiento">
                              Crear mantenimiento
                            </Link>
                          </li>
                        </ul>
                      )}
                    </div>
                  </li>

                  <li>
                    <div className="dropdown">
                      <Link onClick={() => toggleDropdown("secretaria")}>Sec.Académica</Link>
                      {activeDropdown === "secretaria" && (
                        <ul className="dropdown-menu">
                          <li>
                            <Link to="/admin/documentos">Estadística KPI</Link>
                          </li>

                          <li>
                            <Link to="/admin/infoacademico">
                              Informes Académicos
                            </Link>
                          </li>
                          <li>
                            <Link to="registropei">
                              Registro PEI
                            </Link>
                          </li>
                        </ul>
                      )}
                    </div>
                  </li>

                  <li>
                    <div className="dropdown">
                      <Link onClick={() => toggleDropdown("contabilidad")}>Contabilidad</Link>

                      {activeDropdown === "contabilidad" && (
                        <ul className="dropdown-menu">
                          <li>
                            <Link to="cargar_archivo">Cargar Archivo</Link>
                          </li>
                          <li>
                            <Link to="descargar_colilla">
                              Descargar colilla
                            </Link>
                          </li>
                          <li>
                            <Link to="eliminar_colillas">
                              Eliminar colillas
                            </Link>
                          </li>



                        </ul>
                      )}
                    </div>
                  </li>

                  <li>
                    <div className="dropdown">
                      <Link onClick={() => toggleDropdown("backup")}>Backup</Link>

                      {activeDropdown === "backup" && (
                        <ul className="dropdown-menu">

                          <li>
                            <button
                              type="button"
                              onClick={descargarVentasMensualesJSON}
                              style={{
                                background: "none",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                                color: "inherit",
                                font: "inherit",
                              }}
                            >
                              Descargar ventas JSON
                            </button>
                          </li>

                          <li>
                            <button
                              type="button"
                              onClick={descargarAsistenciasJSON}
                              style={{
                                background: "none",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                                color: "inherit",
                                font: "inherit",
                              }}
                            >
                              Descargar asistencias JSON
                            </button>
                          </li>


                        </ul>
                      )}
                    </div>
                  </li>


                </ul>
              )}

              {isAcademic && (
                <ul>

                  <li>
                    <div className="dropdown">
                      <Link onClick={() => toggleDropdown("academico")}>Académico</Link>
                      {activeDropdown === "academico" && (
                        <ul className="dropdown-menu">
                          <li>
                            <Link to="/admin/academico">Reporte académico</Link>
                          </li>
                          <li>
                            <Link to="/admin/documentos">Estadística KPI</Link>
                          </li>
                          <li>
                            <Link to="/admin/llegadastarde">
                              Llegadas tarde
                            </Link>
                          </li>
                          <li>
                            <Link to="/admin/extraclases">
                              Extra curricular
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
                    <div className="dropdown">
                      <Link onClick={() => toggleDropdown("contabilidad")}>Contabilidad</Link>

                      {activeDropdown === "contabilidad" && (
                        <ul className="dropdown-menu">

                          <li>
                            <Link to="descargar_colilla">
                              Descargar colilla de pago
                            </Link>
                          </li>



                        </ul>
                      )}
                    </div>
                  </li>
                </ul>
              )}

              {secretaria && (
                <ul>

                  <li>
                    <div className="dropdown">
                      <Link onClick={() => toggleDropdown("academico")}>Académico</Link>
                      {activeDropdown === "academico" && (
                        <ul className="dropdown-menu">
                          <li>
                            <Link to="/admin/documentos">Estadística KPI</Link>
                          </li>

                          <li>
                            <Link to="/admin/infoacademico">
                              Informes Académicos
                            </Link>
                          </li>
                          <li>
                            <Link to="descargar_colilla">
                              Descargar colilla de pago
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
                </ul>
              )}

              {tesoreria && (
                <ul>

                  <li>
                    <div className="dropdown">
                      <Link onClick={() => toggleDropdown("tesoreria")}>Tesoreria</Link>
                      {activeDropdown === "tesoreria" && (
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
                          <li>
                            <Link to="descargar_colilla">
                              Descargar colilla de pago
                            </Link>
                          </li>
                          <li>
                            <Link to="/admin/extraclases">
                              Extra curricular
                            </Link>
                          </li>
                          <li>
                            <Link to="informesExtraClasesDec">
                              Informe Extraclases
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
                  <li></li>
                </ul>
              )}

              {escuelaPadres && (
                <div className="dropdown">
                  <Link onClick={() => toggleDropdown("escuelaPadres")}>E. Padres</Link>

                  {activeDropdown === "escuelaPadres" && (
                    <ul className="dropdown-menu">
                      <li>
                        <Link to="esc_padres">Registro Asistencia</Link>
                      </li>
                      <li>
                        <Link to="estadisticas_ep">Estadisticas EP</Link>
                      </li>
                      <li>
                        <Link to="crear_ep">Crear Escuela</Link>
                      </li>
                      <li>
                        <Link to="eppagas">Pagos escuelas</Link>
                      </li>
                      <li>
                        <Link to="informe_escuela_padres">
                          Informe pagos EP
                        </Link>
                      </li>
                      <li>
                        <Link to="historico_ep">
                          Historico
                        </Link>
                      </li>
                      <li>
                        <Link to="descargar_colilla">
                          Descargar colilla de pago
                        </Link>
                      </li>

                    </ul>
                  )}
                </div>
              )}


              {isAdministrator && (
                <ul>


                  <div className="admin-layout-header-links-a">
                    <li>
                      <div className="dropdown">
                        <Link onClick={() => toggleDropdown("administracion")}>Administración</Link>

                        {activeDropdown === "administracion" && (
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

                  <li></li>
                </ul>
              )}

              {mantenimiento && (
                <li>
                  <div className="dropdown">
                    <Link onClick={() => toggleDropdown("tareas")}>
                      Tareas y mantenimientos
                    </Link>
                    {activeDropdown === "tareas" && (
                      <ul className="dropdown-menu">
                        <li>
                          <Link to="programadorTareas">Tareas</Link>
                        </li>

                        <li>
                          <Link to="crearMantenimiento">
                            Crear mantenimiento
                          </Link>
                        </li>
                        <li>
                          <Link to="seguimientoMantenimiento">
                            Seguimiento mantenimientos
                          </Link>
                        </li>
                        <li>
                          <Link to="descargar_colilla">
                            Descargar colilla de pago
                          </Link>
                        </li>
                      </ul>
                    )}
                  </div>
                </li>
              )}

              {contabilidad && (
                <li>
                  <div className="dropdown">
                    <Link onClick={() => toggleDropdown("contabilidad")}>Contabilidad</Link>

                    {activeDropdown === "contabilidad" && (
                      <ul className="dropdown-menu">
                        <li>
                          <Link to="cargar_archivo">Cargar Archivo</Link>
                        </li>
                        <li>
                          <Link to="descargar_colilla">
                            Descargar colilla
                          </Link>
                        </li>
                        <li>
                          <Link to="eliminar_colillas">
                            Eliminar colillas
                          </Link>
                        </li>



                      </ul>
                    )}
                  </div>
                </li>
              )}

              {administrativos && (
                <ul>
                  <li>
                    <div className="dropdown">
                      <Link onClick={() => toggleDropdown("academico")}>Académico</Link>
                      {activeDropdown === "academico" && (
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
                          <li>
                            <Link to="/admin/extraclases">
                              Extra curricular
                            </Link>
                          </li>

                        </ul>
                      )}
                    </div>
                  </li>

                  <li>
                    <div className="dropdown">
                      <Link onClick={() => toggleDropdown("administracion")}>Adm</Link>

                      {activeDropdown === "administracion" && (
                        <ul className="dropdown-menu">
                          <li>
                            <Link to="/admin/administracion">Stock</Link>
                          </li>
                          <li>
                            <Link to="/admin/inventario_estadisticas">
                              Estadisticas Inventario
                            </Link>
                          </li>
                          <li>
                            <Link to="/admin/informesgenerales">
                              Informes de Tareas
                            </Link>
                          </li>
                          <li>
                            <Link to="seguimientoMantenimiento">
                              Seguimiento mantenimientos
                            </Link>
                          </li>
                          <li>
                            <Link to="informesExtraClasesDec">
                              Informe Extraclases
                            </Link>
                          </li>
                          <li>
                            <Link to="registroAsistencia">
                              Asistencia Extraclases
                            </Link>
                          </li>
                        </ul>
                      )}
                    </div>
                  </li>

                  <li>
                    <div className="dropdown">
                      <Link onClick={() => toggleDropdown("tesoreria")}>Tesorería</Link>


                      {activeDropdown === "tesoreria" && (
                        <ul className="dropdown-menu">
                          <li>
                            <Link to="tesoreria_adm">Recaudo</Link>
                          </li>
                          <li>
                            <Link to="almuerzos_adm">Almuerzos</Link>
                          </li>

                        </ul>
                      )}
                    </div>
                  </li>

                  <li>
                    <div className="dropdown">
                      <Link onClick={() => toggleDropdown("escuelaPadres")}>E. Padres</Link>

                      {activeDropdown === "escuelaPadres" && (
                        <ul className="dropdown-menu">
                          <li>
                            <Link to="esc_padres">Registro Asistencia</Link>
                          </li>
                          <li>
                            <Link to="estadisticas_ep">Estadisticas EP</Link>
                          </li>
                          <li>
                            <Link to="crear_ep">Crear Escuela</Link>
                          </li>
                          <li>
                            <Link to="eppagas">Pagos escuelas</Link>
                          </li>
                          <li>
                            <Link to="informe_escuela_padres">
                              Informe pagos EP
                            </Link>
                          </li>
                        </ul>
                      )}
                    </div>
                  </li>

                  <li>
                    <div className="dropdown">
                      <Link onClick={() => toggleDropdown("tareas")}>
                        Tareas y mantenimientos
                      </Link>
                      {activeDropdown === "tareas" && (
                        <ul className="dropdown-menu">
                          <li>
                            <Link to="programadorTareas">Tareas</Link>
                          </li>

                          <li>
                            <Link to="crearMantenimiento">
                              Crear mantenimiento
                            </Link>
                          </li>
                        </ul>
                      )}
                    </div>
                  </li>



                  <li>
                    <div className="dropdown">
                      <Link onClick={() => toggleDropdown("contabilidad")}>Contabilidad</Link>

                      {activeDropdown === "contabilidad" && (
                        <ul className="dropdown-menu">
                          {/* <li>
                            <Link to="cargar_archivo">Cargar Archivo</Link>
                          </li> */}
                          <li>
                            <Link to="descargar_colilla">
                              Descargar colilla
                            </Link>
                          </li>


                        </ul>
                      )}
                    </div>
                  </li>



                </ul>
              )}

              {directivas && (
                <ul>
                  <li>
                    <div className="dropdown">
                      <Link onClick={() => toggleDropdown("academico")}>Académico</Link>
                      {activeDropdown === "academico" && (
                        <ul className="dropdown-menu">
                          <li>
                            <Link to="/admin/academico">Reporte académico</Link>
                          </li>
                          <li>
                            <Link to="/admin/documentos">Estadística KPI</Link>
                          </li>
                          <li>
                            <Link to="/admin/llegadastarde">
                              Llegadas tarde
                            </Link>
                          </li>
                          <li>
                            <Link to="/admin/extraclases">
                              Extra curricular
                            </Link>
                          </li>

                        </ul>
                      )}
                    </div>
                  </li>

                  <li>
                    <div className="dropdown">
                      <Link onClick={() => toggleDropdown("planMejoramiento")}>Plan de Mejoramiento</Link>

                      {activeDropdown === "planMejoramiento" && (
                        <ul className="dropdown-menu">
                          <li>
                            <Link to="control_semanal">Control semanal</Link>
                          </li>
                          <li>
                            <Link to="checkupDashboard">Seguimiento</Link>
                          </li>
                          <li>
                            <Link to="listarRegistroscheckup">Lista de Registros</Link>
                          </li>






                        </ul>
                      )}
                    </div>
                  </li>

                  <li>
                    <div className="dropdown">
                      <Link onClick={() => toggleDropdown("administracion")}>Adm</Link>

                      {activeDropdown === "administracion" && (
                        <ul className="dropdown-menu">
                          {/* <li>
                            <Link to="/admin/administracion">Stock</Link>
                          </li>
                          <li>
                            <Link to="/admin/inventario_estadisticas">
                              Estadisticas Inventario
                            </Link>
                          </li> */}
                          <li>
                            <Link to="/admin/informesgenerales">
                              Informes de Tareas
                            </Link>
                          </li>
                          <li>
                            <Link to="seguimientoMantenimiento">
                              Seguimiento mantenimientos
                            </Link>
                          </li>
                          <li>
                            <Link to="informesExtraClasesDec">
                              Informe Extraclases
                            </Link>
                          </li>
                          {/* <li>
                            <Link to="registroAsistencia">
                              Asistencia Extraclases
                            </Link>
                          </li> */}
                          <li>
                            <Link to="informe_escuela_padres">
                              Informe pagos EP
                            </Link>
                          </li>
                          <li>
                            <Link to="descargar_colilla">
                              Descargar colilla
                            </Link>
                          </li>
                        </ul>
                      )}
                    </div>
                  </li>




                </ul>
              )}



            </nav>
          </div>
        </div>
       
        

      

          <button
            type="button"
            className="cerrar"
            onClick={handleLogout}
          >
            Cerrar
          </button>
          
        
      </div>
    </div>
  );
};

export default AdminHeader;