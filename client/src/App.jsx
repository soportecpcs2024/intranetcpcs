import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProductProvider } from "./contexts/ProductContext"; // Ensure ProductProvider is imported
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
      <ProductProvider> {/* Wrap your app with ProductProvider */}
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
          <Route element={<AdminLayout />}>
            {/* Admin routes */}
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/blog" element={<Blog />} />
            <Route path="/admin/academico" element={<Layout />}>
              <Route index element={<General />} />
              <Route path="/admin/academico/general" element={<General />} />
              <Route path="/admin/academico/areas" element={<Areas />} />
              <Route
                path="/admin/academico/nivelSuperior"
                element={<NivelSuperior />}
              />
              <Route
                path="/admin/academico/individual"
                element={<InfoIndividual />}
              />
              <Route
                path="/admin/academico/estdificultades"
                element={<DashboardEstDificultades />}
              />
            </Route>
            <Route path="/admin/documentos" element={<Documentos />} />
            <Route path="/admin/llegadastarde" element={<LlegadasTarde />} />
            <Route path="/admin/descargarpdf" element={<DescargarPdf />} />
            <Route path="/admin/soporte" element={<AgregarLlegadasTarde />} />
            <Route path="/admin/*" element={<Navigate to="/admin/users" />} />

            {/* Inventory routes */}
            <Route path="/admin/administracion" element={<DashboardInventory />}>
              <Route path="productList" element={<ProductList />} />
              <Route path="add-product" element={<AddProduct />} />  
              <Route path="assign-product" element={<CreateUnits />} />
              <Route path="/admin/administracion/product-detail/:id" element={<ProductDetail />} />
              <Route path="/admin/administracion/edit-product/:id" element={<EditProduct />} />
            </Route>
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
