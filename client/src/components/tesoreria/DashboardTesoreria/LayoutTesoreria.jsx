import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import Footer from "../../../pages/admin/User/footer/Footer";
import { SiGoogleclassroom } from "react-icons/si";
import { SiMdbook } from "react-icons/si";
import { LiaWpforms } from "react-icons/lia";
import { GiLovers } from "react-icons/gi";
import { IoDownloadOutline } from "react-icons/io5";
import * as XLSX from "xlsx";
import { useRecaudo } from "../../../contexts/RecaudoContext"; // Asegúrate de importar el contexto correcto

import ".//LayoutTesoreria.css";

const LayoutTesoreria = () => {
  const { facturas } = useRecaudo(); // Obtiene las facturas desde el contexto

  // Función para descargar las facturas en Excel agrupadas por nombre de clase
  const handleDownloadExcel = () => {
    if (facturas.length === 0) {
      alert("No hay facturas disponibles para descargar.");
      return;
    }

    // Crear un objeto para agrupar las facturas por nombre de clase
    const groupedByClase = {};

    facturas.forEach((factura) => {
      factura.clases.forEach((clase) => {
        // Si aún no existe una clave para este nombre de clase, crea un array
        if (!groupedByClase[clase.nombreClase]) {
          groupedByClase[clase.nombreClase] = [];
        }
        
        // Agregar la factura a la clase correspondiente
        groupedByClase[clase.nombreClase].push({
          "ID Factura": factura._id,
          "Nombre Estudiante": factura.estudianteId?.nombre || "N/A",
          Documento: factura.estudianteId?.documentoIdentidad || "N/A",
          Grado: factura.estudianteId?.grado || "N/A",
          "Nombre Clase": clase.nombreClase,
          Día: clase.dia,
          Hora: clase.hora,
          "Total Pagado": factura.total,
          "Tipo de Pago": factura.tipoPago,
          "Fecha Compra": new Date(factura.fechaCompra).toLocaleDateString(),
        });
      });
    });

    // Convertir el objeto agrupado en un array de objetos para exportar
    const formattedData = [];
    for (const clase in groupedByClase) {
      groupedByClase[clase].forEach((facturaData) => {
        formattedData.push(facturaData);
      });
    }

    // Convertir datos al formato de Excel
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Facturas por Clase");

    // Descargar archivo
    XLSX.writeFile(workbook, "facturas_por_clase.xlsx");
  };

  return (
    <div className="layout-academico-container">
      <header className="layout-academico-container-division">
        <div className="layout-academico-container-header">
          <div className="link-recaudo">
            <SiGoogleclassroom className="icon-academico" />
            <NavLink
              to="recaudo"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link-academico active"
                  : "sidebar-link-academico"
              }
            >
              <span>Extra Clases</span>
            </NavLink>
          </div>

          <div className="link-recaudo">
            <SiMdbook className="icon-academico" />
            <NavLink
              to="antologia"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link-academico active"
                  : "sidebar-link-academico"
              }
            >
              <span>Antología</span>
            </NavLink>
          </div>

          <div className="link-recaudo">
            <GiLovers className="icon-academico" />
            <NavLink
              to="escuela_padres"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link-academico active"
                  : "sidebar-link-academico"
              }
            >
              <span>Escuela de Padres</span>
            </NavLink>
          </div>

          <div className="link-academico">
            <LiaWpforms className="icon-academico" />
            <NavLink
              to="formulario_inscripcion"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link-academico active"
                  : "sidebar-link-academico"
              }
            >
              <span>Formularios</span>
            </NavLink>
          </div>
        </div>

        <div className="layout-academico-container-header">
          <div className="link-academico">
            <IoDownloadOutline
              onClick={handleDownloadExcel}
              className="descarga_icon_factura"
            />
          </div>
        </div>
      </header>

      <main className="content-academico">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default LayoutTesoreria;
