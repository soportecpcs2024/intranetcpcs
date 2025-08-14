import { useState, useEffect } from "react";
import { useRecaudo } from "../../../contexts/RecaudoContext";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const DescargaInformeEPPagasExcel = () => {
  const [mesSeleccionado, setMesSeleccionado] = useState("");
  const { facturas } = useRecaudo();
  const [facturasFiltradas, setFacturasFiltradas] = useState([]);

  useEffect(() => {
    if (facturas.length > 0) {
      const codValidos = ["1300", "1400", "1600", "1700"];

      const nuevasFacturas = facturas
        .filter((factura) =>
          factura.clases?.some((clase) =>
            codValidos.includes(clase.cod?.toString())
          )
        )
        .map((factura) => ({
          ...factura,
          nombreEstudiante: factura.estudianteId?.nombre?.trim() || "Desconocido",
        }));

      setFacturasFiltradas(nuevasFacturas);
    }
  }, [facturas]);

  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];

  const generarInformeExcel = async () => {
    if (!facturasFiltradas || facturasFiltradas.length === 0) {
      alert("No hay facturas disponibles.");
      return;
    }

    // Filtrar datos según mes seleccionado (o todos si está vacío)
    const datosFiltrados = [];
    facturasFiltradas.forEach((factura) => {
      const fecha = new Date(factura.fechaCompra);
      const mesFactura = fecha.toLocaleString("es-ES", { month: "long" });

      if (mesSeleccionado && mesFactura.toLowerCase() !== mesSeleccionado.toLowerCase()) return;

      factura.clases.forEach((clase) => {
        datosFiltrados.push({
          Estudiante: factura.estudianteId?.nombre || "N/A",
          Grado: factura.estudianteId?.grado || "N/A",
          NombreClase: clase.nombreClase || "N/A",
          Total: factura.total,
        });
      });
    });

    if (datosFiltrados.length === 0) {
      alert("No hay datos para el mes seleccionado.");
      return;
    }

    // Ordenar por Grado
    datosFiltrados.sort((a, b) => a.Grado.localeCompare(b.Grado));

    // Crear workbook y hoja
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Informe");

    // Título
    sheet.mergeCells("A1", "D1");
    sheet.getCell("A1").value = `Informe Escuelas de Padres - ${mesSeleccionado || "del año"}`;
    sheet.getCell("A1").font = { size: 16, bold: true };
    sheet.getCell("A1").alignment = { horizontal: "center" };

    // Encabezados
    const headers = ["Estudiante", "Grado", "NombreClase", "Total"];
    const headerRow = sheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9D9D9" },
      };
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Filas con datos
    datosFiltrados.forEach((dato) => {
      const row = sheet.addRow([
        dato.Estudiante,
        dato.Grado,
        dato.NombreClase,
        dato.Total,
      ]);
      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        if (colNumber === 4) {
          cell.numFmt = '"$"#,##0';
        }
      });
    });

    // Ajustar ancho columnas
    sheet.columns = [
      { width: 30 },
      { width: 15 },
      { width: 25 },
      { width: 15 },
    ];

    // Descargar
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Informe_Esc_Padres_${mesSeleccionado || "Todos"}.xlsx`);
  };

  return (
    <div className="layout-academico-container">
      <header className="layout-academico-container-division">
        <div className="informes-container">
          <div className="informes-lista-titulo">
            <h5>Generar Informe por Mes</h5>
          </div>
          <ul className="informes-lista">
            <li>
              <select
                className="select-mes"
                value={mesSeleccionado}
                onChange={(e) => setMesSeleccionado(e.target.value)}
              >
                <option value="">-- Todos los Meses --</option>
                {meses.map((mes, index) => (
                  <option key={index} value={mes}>
                    {mes.charAt(0).toUpperCase() + mes.slice(1)}
                  </option>
                ))}
              </select>
            </li>
            <li>
              <button
                className="informe-item btn-excel"
                onClick={generarInformeExcel}
              >
                Generar Excel
              </button>
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
};

export default DescargaInformeEPPagasExcel;
