// src/pages/admin/User/ListaFacturas.jsx
import React from "react";
import { useRecaudo } from "../../../contexts/RecaudoContext";

const ListarExtraCurricular = () => {
  const { facturas } = useRecaudo();

  return (
    <div className="lista-facturas-container">
      <h2>Lista de Facturas</h2>
      {/* Aquí podrías mapear las facturas para mostrarlas */}
    </div>
  );
};

 
export default ListarExtraCurricular