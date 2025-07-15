import React, { useEffect, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProductProvider } from "./contexts/ProductContext";
import { ProductStatisticsProvider } from "./contexts/InformesContext";
import { UserProvider } from "./contexts/UserContext";
import { RecaudoProvider } from "./contexts/RecaudoContext";
import { EscuelaPadresProvider } from "./contexts/EscuelaPadresContext";
import { TareasProvider } from "./contexts/TareaContext";
import { Auth, Blog } from "./pages/admin";
import "./App.css";

// Componentes cargados con lazy
const AdminLayout = React.lazy(() => import("./layouts/adminLayouts/AdminLayout"));
const General = React.lazy(() => import("./pages/admin/academicos/General"));
const Areas = React.lazy(() => import("./pages/admin/academicos/Areas"));
const Layout = React.lazy(() => import("./components/Layout"));
const Users = React.lazy(() => import("./pages/admin/User/main/Users"));
const DescargarPdf = React.lazy(() => import("./components/DescargarPdf"));
const DashboardEstDificultades = React.lazy(() => import("./components/DashboardEstDificultades"));

// Importación directa (no lazy)
import Documentos from "./pages/admin/academicos/Documentos";
import { InfoIndividual } from "./pages/admin/academicos/InfoIndividual";
import LlegadasTarde from "./pages/admin/academicos/llegadast/LlegadasTarde";
import NivelSuperior from "./pages/admin/academicos/nivelSuperior/NivelSuperior";
import DashboardInventory from "./pages/inventory/DashboardInventory/DashboardInventory";
import ProductList from "./components/productos/ProductList/ProductList";
import AddProduct from "./components/productos/AddProducts/AddProduct";
import ProductDetail from "./components/productos/ProductDetail/ProductDetail";
import EditProduct from "./components/productos/editProduct/EditProduct";
import CreateUnits from "./components/productos/unidades/crearUnidad/CreateUnits";
import AddLocation from "./components/productos/Location/AddLocation";
import Reportbug from "./components/productos/Bug/Reportbug";
import ListarUnidades from "./components/productos/unidades/ListarUnidades/ListarUnidades";
import UnitDetail from "./components/productos/unidades/UnitDetail/UnitDetail";
import LocationList from "./components/productos/Location/LocationList/LocationList";
import UnitUpdate from "./components/productos/unidades/ActualizarUnidad/UnitUpdate";
import AgregarLlegadasTarde from "./pages/admin/soporte/adicionarllegadastarde/AgregarLlegadasTarde";
import LocationDetails from "./components/productos/Location/LocationDetails/LocationDetails";
import EditLocation from "./components/productos/Location/EditLocation/EditLocation";
import Estadisticas from "./components/productos/statistics/prueba/Estadisticas";
import DashboardStatistics from "./components/productos/statistics/dashboardStatistics/DashboardStatistics";
import InfoStock from "./components/productos/informes/stock/InfoStock";
import SubCategory from "./components/productos/informes/subcategory/SubCategory";
import ProductDistribution from "./components/productos/Location/productDistribution/ProductDistribution";
import InformeUnidad from "./components/productos/informes/informeUnidad/InformeUnidad";
import LayoutInfoAcademicos from "./components/informesAcademicos/DashboardInformesAcademicos/LayoutInfoAcademicos";
import CertificadoEstudios from "./components/informesAcademicos/CertificadoEstudios/CertificadoEstudios";
import AcumuladosNotas from "./components/informesAcademicos/AcumuladosNotas/AcumuladosNotas";
import Estadistico from "./components/informesAcademicos/Estadistico/Estadistico";
import Dashboardquinto from "./components/informesAcademicos/quinto_Informe_b/Dashboardquinto";
import LayoutTesoreria from "./components/tesoreria/DashboardTesoreria/LayoutTesoreria";
import Recaudo from "./components/tesoreria/DashboardTesoreria/Recaudo/Recaudo";
import FormularioInscripcion from "./components/tesoreria/Formularios_inscripcion/FormularioInscripcion";
import RecaudoAntologia from "./components/tesoreria/DashboardTesoreria/Recaudo/antologia/RecaudoAntologia";
import Recaudoep from "./components/tesoreria/DashboardTesoreria/Recaudo/RecaudoEscuelaPadres";
import ListarFacturas from "./components/tesoreria/DashboardTesoreria/Recaudo/ListarFacturas/ListarFacturas";
import Almuerzos from "./components/tesoreria/DashboardTesoreria/Recaudo/Almuerzos/Almuerzos";
import Coordinadores from "./components/Academico/Coordinadores";
import PreEscolar from "./components/Academico/secciones/pre_escolar/PreEscolar";
import BasicaPrimaria from "./components/Academico/secciones/basica_primaria/BasicaPrimaria";
import BasicaSecundaria from "./components/Academico/secciones/basica_secundaria/BasicaSecundaria";
import MediaAcademica from "./components/Academico/secciones/media_academica/MediaAcademica";
import DashboardEscPadres from "./components/EscPadres/DashboardEP/DashboardEscPadres";
import DashboardProgramadorTareas from "./components/programadorTareas/DashboardProgramadorTareas/DashboardProgramadorTareas";
import CrearTarea from "./components/programadorTareas/paginasTareas/CrearTarea";
import ListarTareas from "./components/programadorTareas/paginasTareas/ListarTareas";
import EstadisticasTareas from "./components/programadorTareas/paginasTareas/EstadisticasTareas";
import DashboardExtraCurricular from "./components/tesoreria/extracurricular/DashboardExtraCurricular";
import ExtraIngles from "./components/tesoreria/extracurricular/ExtraIngles";
import ExtraPiano from "./components/tesoreria/extracurricular/ExtraPiano";
import ExtraIniciaMusical from "./components/tesoreria/extracurricular/ExtraIniciaMusical";
import CrearEscuelaPadres from "./components/EscPadres/CrearEscuela/CrearEscuelaPadres";
import EstadisticasEp from "./components/EscPadres/EstadisticasEP/EstadisticasEp";
import ListaEPPagas from "./components/EscPadres/listaEPPagas/ListaEPPagas";
import { GraduateProvider } from "./contexts/GraduateContext";
import { ActasDeGradoProvider } from "./contexts/ActasDeGradoContext";
 

 
 
const ExploracionMotris = React.lazy(()=> import("./components/tesoreria/extracurricular/ExploracionMotris"));
const Artes = React.lazy(()=> import("./components/tesoreria/extracurricular/Artes"));
const Voleibol = React.lazy(()=> import("./components/tesoreria/extracurricular/Voleibol"));
const Microfutbol = React.lazy(()=> import("./components/tesoreria/extracurricular/Microfutbol"));
 
const Baloncesto = React.lazy(()=> import("./components/tesoreria/extracurricular/Baloncesto"));
const Bateria = React.lazy(()=> import("./components/tesoreria/extracurricular/Bateria"));
const Tecnicavocal = React.lazy(()=> import( "./components/tesoreria/extracurricular/Tecnicavocal"));
const GuitarraBajo = React.lazy(()=> import( "./components/tesoreria/extracurricular/GuitarraBajo"));

const ActasGrados = React.lazy(()=> import("./components/informesAcademicos/ActasGrados/ActasGrados"));




const App = () => {
  useEffect(() => {
    localStorage.setItem("lastActivity", Date.now().toString());
    const lastActivity = localStorage.getItem("lastActivity");
    if (lastActivity) {
      const now = Date.now();
      const timeDifference = now - parseInt(lastActivity, 10);
      const sessionTimeout = 1000 * 60 * 60 * 24; // 24 hours
      if (timeDifference > sessionTimeout) {
        localStorage.clear();
      }
    }

    const handleBeforeUnload = () => {
      localStorage.clear();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <AuthProvider>
      <ProductProvider>
        <ProductStatisticsProvider>
          <UserProvider>
            <RecaudoProvider>
              <TareasProvider>
                <EscuelaPadresProvider>
                 <ActasDeGradoProvider>
                  <AppContent />
                 </ActasDeGradoProvider>
                </EscuelaPadresProvider>
              </TareasProvider>
            </RecaudoProvider>
          </UserProvider>
        </ProductStatisticsProvider>
      </ProductProvider>
    </AuthProvider>
  );
};

const AppContent = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Cargando...</div>}>
        <Routes>
          {!user ? (
            <>
              <Route index element={<Auth />} />
              <Route path="/admin/*" element={<Navigate to="/admin" />} />
            </>
          ) : (
            <Route path="/admin/*" element={<AdminLayout />}>
              <Route path="users" element={<Users />} />
              <Route path="blog" element={<Blog />} />
              <Route path="academico" element={<Layout />}>
                <Route index element={<General />} />
                <Route path="general" element={<General />} />
                <Route path="areas" element={<Areas />} />
                <Route path="quinto_informe" element={<Dashboardquinto />} />
                <Route path="secciones" element={<Coordinadores />}>
                  <Route path="preescolar" element={<PreEscolar />} />
                  <Route path="bprimaria" element={<BasicaPrimaria />} />
                  <Route path="bsecundaria" element={<BasicaSecundaria />} />
                  <Route path="macademica" element={<MediaAcademica />} />
                </Route>
                <Route path="nivelSuperior" element={<NivelSuperior />} />
                <Route path="individual" element={<InfoIndividual />} />
                <Route path="estdificultades" element={<DashboardEstDificultades />} />
              </Route>

              <Route path="documentos" element={<Documentos />} />
              <Route path="llegadastarde" element={<LlegadasTarde />} />
              <Route path="descargarpdf" element={<DescargarPdf />} />
              <Route path="soporte" element={<AgregarLlegadasTarde />} />

              <Route path="extraclases" element={<DashboardExtraCurricular />}>
                <Route path="ingles" element={<ExtraIngles />} />
                <Route path="iniciamusical" element={<ExtraIniciaMusical />} />
                <Route path="piano" element={<ExtraPiano />} />
                <Route path="tecnicavocal" element={<Tecnicavocal />} />
                <Route path="guitarrabajo" element={<GuitarraBajo />} />
                <Route path="bateria" element={<Bateria />} />
                <Route path="baloncesto" element={<Baloncesto />} />
                <Route path="voleibol" element={<Voleibol />} />
                <Route path="microfutbol" element={<Microfutbol />} />
                <Route path="arte" element={<Artes />} />
                <Route path="exploracionmotriz" element={<ExploracionMotris />} />
              </Route>

              <Route path="administracion" element={<DashboardInventory />}>
                <Route index element={<ProductList />} />
                <Route path="add-product" element={<AddProduct />} />
                <Route path="createUnits" element={<CreateUnits />} />
                <Route path="productList" element={<ProductList />} />
                <Route path="createlocation" element={<AddLocation />} />
                <Route path="repbug" element={<Reportbug />} />
                <Route path="listunit" element={<ListarUnidades />} />
                <Route path="location_list" element={<LocationList />} />
                <Route path="product-detail/:id" element={<ProductDetail />} />
                <Route path="edit-product/:id" element={<EditProduct />} />
                <Route path="units/:id" element={<UnitDetail />} />
                <Route path="updateunits/:id" element={<UnitUpdate />} />
                <Route path="locationdetails" element={<LocationDetails />} />
                <Route path="editlocation/:id" element={<EditLocation />} />
              </Route>

              <Route path="inventario_estadisticas" element={<DashboardStatistics />}>
                <Route index element={<Estadisticas />} />
                <Route path="infostock" element={<InfoStock />} />
                <Route path="subcategory" element={<SubCategory />} />
                <Route path="distribution" element={<ProductDistribution />} />
                <Route path="unit_report" element={<InformeUnidad />} />
              </Route>

              <Route path="infoacademico" element={<LayoutInfoAcademicos />}>
                <Route path="certificado-estudios" element={<CertificadoEstudios />} />
                <Route path="acumulados-notas" element={<AcumuladosNotas />} />
                <Route path="actas_grados" element={<ActasGrados />} />
              </Route>

              <Route path="tesoreria" element={<LayoutTesoreria />}>
                <Route path="recaudo" element={<Recaudo />} />
                <Route path="antologia" element={<RecaudoAntologia />} />
                <Route path="escuela_padres" element={<Recaudoep />} />
                <Route path="almuerzos" element={<Almuerzos />} />
                <Route path="lista_facturas" element={<ListarFacturas />} />
                <Route path="formulario_inscripcion" element={<FormularioInscripcion />} />
              </Route>

              <Route path="esc_padres" element={<DashboardEscPadres />} />
              <Route path="crear_ep" element={<CrearEscuelaPadres />} />
              <Route path="estadisticas_ep" element={<EstadisticasEp />} />
              <Route path="eppagas" element={<ListaEPPagas />} />

              <Route path="programadorTareas" element={<DashboardProgramadorTareas />}>
                <Route path="crear" element={<CrearTarea />} />
                <Route path="listar" element={<ListarTareas />} />
                <Route path="estadisticas" element={<EstadisticasTareas />} />
              </Route>
            </Route>
          )}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
