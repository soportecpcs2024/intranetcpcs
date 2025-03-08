import React from 'react';
import * as XLSX from 'xlsx';
import { useRecaudo } from '../../../../../contexts/RecaudoContext';

const DescargaArchivoFacturaEspecifica = () => {
  const { facturas } = useRecaudo();

  const handleDownload = () => {
    if (!facturas || facturas.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }

    // Buscar la factura con el _id específico
    const factura = facturas.find(f => f._id["$oid"] === "67afdf459f08cbfd1056c415");

    if (!factura) {
      alert('Factura no encontrada.');
      return;
    }

    // Organizar los datos de la factura seleccionada
    const data = [
      ["ID Factura", factura._id["$oid"]],
      ["Cod Factura", factura.cod["$oid"]],
      ["Estudiante ID", factura.estudianteId["$oid"]],
      ["Nombre Estudiante", factura.estudianteId.nombre],
      ["Documento Identidad", factura.estudianteId.documentoIdentidad],
      ["Grado", factura.estudianteId.grado],
      ["Clases", factura.clases.map(c => c.nombreClase).join(", ")],
      ["Días", factura.clases.map(c => c.dia).join(", ")],
      ["Horas", factura.clases.map(c => c.hora).join(", ")],
      ["Costos de Clases", factura.clases.map(c => c.costo).join(", ")],
      ["Total Factura", factura.total],
      ["Nombre Registrador", factura.nombreRegistrador],
      ["Tipo de Pago", factura.tipoPago],
      ["Fecha Compra", new Date(factura.fechaCompra["$date"]).toLocaleDateString()]
    ];

    // Crear la hoja de Excel
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Factura");

    // Descargar el archivo Excel
    XLSX.writeFile(wb, "factura_67afdf459f08cbfd1056c415.xlsx");
  };

  return (
    <button onClick={handleDownload} className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600">
      Descargar Factura en Excel
    </button>
  );
};

export default DescargaArchivoFacturaEspecifica;
