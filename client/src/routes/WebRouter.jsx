import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/web"; // Importa el componente Home

export function WebRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Otras rutas para la parte web si es necesario */}
    </Routes>
  );
}

 
