import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import {
  Auth,
  Users,
  Blog,
  Academicos,
  Administrativos,
  Q10,
} from "./pages/admin";
import { Home } from "./pages/web";
import AdminLayout from "./layouts/adminLayouts/AdminLayout";
import ClientLayouts from "./layouts/clientLayouts/ClientLayouts";
import Colegio from "./pages/web/Colegio";
import Contactos from "./pages/web/Contactos";
import Q10Web from "./pages/web/Q10web";
import './App.css'
import General from "./pages/admin/academicos/General";
import Areas from "./pages/admin/academicos/Areas";
import Layout from "./components/Layout";
import InformeAcademico from "./pages/admin/InformeAcademico";
import DashboardEstDificultades from "./components/DashboardEstDificultades";
import Documentos from "./pages/admin/academicos/Documentos";
import InformeAreaGrupPDF from "./pages/admin/academicos/InformeAreaGrupPDF";
import DescargarPdf from "./components/DescargarPdf";
import { InfoIndividual } from "./pages/admin/academicos/InfoIndividual";


const App = () => {
  useEffect(() => {
    // Establece la marca temporal cuando la página se carga
    localStorage.setItem('lastActivity', Date.now().toString());

    // Verifica la actividad al cargar la página
    const lastActivity = localStorage.getItem('lastActivity');
    if (lastActivity) {
      const now = Date.now();
      const timeDifference = now - parseInt(lastActivity, 10);

      // Ajusta el intervalo de tiempo según lo necesites
      const sessionTimeout = 1000 * 60 * 60 * 24; // 24 horas

      if (timeDifference > sessionTimeout) {
        localStorage.clear();
      }
    }

    // Limpia el localStorage cuando la pestaña o ventana se cierra
    const handleBeforeUnload = () => {
      localStorage.clear();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const AppContent = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false); // Estado de carga

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
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/blog" element={<Blog />} />
            <Route path="/admin/academico" element={<Layout />}>
              <Route index element={<General />} />
              <Route path="/admin/academico/general" element={<General />} />
              <Route path="/admin/academico/areas" element={<Areas />} />              
              <Route path="/admin/academico/individual" element={<InfoIndividual />} />              
              <Route path="/admin/academico/estdificultades" element={<DashboardEstDificultades />} />
            </Route>
            <Route path="/admin/documentos" element={<Documentos />} />              
            <Route path="/admin/descargarpdf" element={<DescargarPdf />} />              
            <Route path="/admin/administracion" element={<Administrativos />} />
            <Route path="/admin/q10" element={<Q10 />} />
            <Route path="/admin/*" element={<Navigate to="/admin/users" />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
