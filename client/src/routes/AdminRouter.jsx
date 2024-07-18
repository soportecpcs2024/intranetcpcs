import { Routes, Route } from "react-router-dom";
import { Auth } from "../pages/admin";

//const user = null; // { email: "correo@gmail.com"}; // Supongamos que aquí se verifica si el usuario está autenticado

export function AdminRouter() {
  return (
    <Routes>
      <Route path="/admin/*" element={<Auth />} />
    </Routes>
  );
}

 
