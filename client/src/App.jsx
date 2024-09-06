import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProductProvider } from "./contexts/ProductContext";
import { Auth, Blog, Academicos, Q10 } from "./pages/admin";
import AdminLayout from "./layouts/adminLayouts/AdminLayout";
import "./App.css";
import General from "./pages/admin/academicos/General";
import Areas from "./pages/admin/academicos/Areas";
import Layout from "./components/Layout";
import DashboardEstDificultades from "./components/DashboardEstDificultades";
import Documentos from "./pages/admin/academicos/Documentos";
import DescargarPdf from "./components/DescargarPdf";
import { InfoIndividual } from "./pages/admin/academicos/InfoIndividual";
import Users from "./pages/admin/User/main/Users";
import LlegadasTarde from "./pages/admin/academicos/llegadast/LlegadasTarde";
import AgregarLlegadasTarde from "./pages/admin/academicos/llegadast/AgregarLlegadasTarde";
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
import QrScanner from "./pages/inventory/QR/QrScanner";

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
        <AppContent />
      </ProductProvider>
    </AuthProvider>
  );
};

const AppContent = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        {!user ? (
          <>
            <Route index element={<Auth />} />
            <Route path="/admin/*" element={<Navigate to="/admin" />} />
          </>
        ) : (
          <Route path="/admin/*" element={<AdminLayout />}>
            {/* Admin routes */}
            <Route path="users" element={<Users />} />
            <Route path="blog" element={<Blog />} />
            <Route path="academico" element={<Layout />}>
              <Route index element={<General />} />
              <Route path="general" element={<General />} />
              <Route path="areas" element={<Areas />} />
              <Route path="nivelSuperior" element={<NivelSuperior />} />
              <Route path="individual" element={<InfoIndividual />} />
              <Route path="estdificultades" element={<DashboardEstDificultades />} />
            </Route>
            <Route path="documentos" element={<Documentos />} />
            <Route path="llegadastarde" element={<LlegadasTarde />} />
            <Route path="descargarpdf" element={<DescargarPdf />} />
            <Route path="soporte" element={<AgregarLlegadasTarde />} />

            {/* Inventory routes */}
            <Route path="administracion" element={<DashboardInventory />}>
              <Route index element={<ProductList />} />
              <Route path="productList" element={<ProductList />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="createUnits" element={<CreateUnits />} />
              <Route path="createlocation" element={<AddLocation />} />
              <Route path="repbug" element={<Reportbug />} />
              <Route path="listunit" element={<ListarUnidades />} />
               
              <Route path="qr-scanner" element={<QrScanner />} />
              <Route path="product-detail/:id" element={<ProductDetail />} />
              <Route path="edit-product/:id" element={<EditProduct />} />
              <Route path="units/:id" element={<UnitDetail />} /> {/* Added UnitDetail route */}
            </Route>
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
