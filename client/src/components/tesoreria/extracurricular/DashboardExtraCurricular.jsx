import { Outlet, NavLink } from "react-router-dom";
import Footer from "../../../pages/admin/User/footer/Footer";

import { FaListCheck } from "react-icons/fa6";
import * as XLSX from "xlsx";
import { useRecaudo } from "../../../contexts/RecaudoContext"; // Asegúrate de importar el contexto correcto
import "./extracurricular.css";

const DashboardExtraCurricular = () => {
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
          "Cod Factura": clase.cod,
          Día: clase.dia,
          Hora: clase.hora,
          "Total Pagado": factura.total,
          "Tipo de Pago": factura.tipoPago,
          "Mes aplicado": factura.mes_aplicado,
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
    <div className="layout-extraclases-container">
      <div className="link-extraclases">
        <NavLink to="ingles">Inglés</NavLink>
        <NavLink to="iniciamusical">Iniciación musical</NavLink>
        <NavLink to="piano">Piano</NavLink>
         
      </div>

      <main className="content-academico">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default DashboardExtraCurricular;
