import { useState, useEffect } from "react";
import { useRecaudo } from "../../../contexts/RecaudoContext";

import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  TextRun,
  AlignmentType,
} from "docx";
import { saveAs } from "file-saver";
import KPIsExtraClases from "./KPIsExtraClases";

const InformeExtraClasesDec = () => {
  const [mesSeleccionado, setMesSeleccionado] = useState("");
  const { facturas } = useRecaudo();
  const [facturasFiltradas, setFacturasFiltradas] = useState([]);

   
  useEffect(() => {
    if (facturas.length > 0) {
      const codValidos = [
        "100",
        "200",
        "300",
        "400",
        "500",
        "600",
        "700",
        "800",
        "900",
        "1000",
        "1100",
      ];

      const nuevasFacturas = facturas
        .filter((factura) =>
          factura.clases?.some((clase) =>
            codValidos.includes(clase.cod?.toString())
          )
        )
        .map((factura) => ({
          ...factura,
          nombreEstudiante:
            factura.estudianteId?.nombre?.trim() || "Desconocido",
        }));

      setFacturasFiltradas(nuevasFacturas);
    }
  }, [facturas]);

  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  const getNombreCodigo = (cod) => {
    switch (cod) {
      case "100":
        return "Inglés";
      case "200":
        return "Iniciación Musical Preescolar";
      case "300":
        return "Piano";
      case "400":
        return "Tecnica Vocal";
      case "500":
        return "Guitarra y Bajo";
      case "600":
        return "Bateria";
      case "700":
        return "Baloncesto";
      case "800":
        return "Voleibol";
      case "900":
        return "Microfútbol";
       
      case "1100":
        return "Exploración Motriz y Predeportiva Pre";

      default:
        return `Código: ${cod}`;
    }
  };

  const generarInformeWord = () => {
    if (!facturas || facturas.length === 0) {
      alert("No hay facturas disponibles.");
      return;
    }

    if (!mesSeleccionado) {
      alert("Selecciona un mes.");
      return;
    }

    const agrupado = {};

    facturasFiltradas.forEach((factura) => {
      const fecha = new Date(factura.fechaCompra);
      const mesFactura = fecha.toLocaleString("es-ES", { month: "long" });

      if (mesFactura.toLowerCase() !== mesSeleccionado.toLowerCase()) return;

      factura.clases.forEach((clase) => {
        const cod = clase.cod;
        if (!agrupado[cod]) agrupado[cod] = [];

        agrupado[cod].push({
          estudiante: factura.estudianteId?.nombre || "N/A",
          nombreClase: clase.nombreClase || getNombreCodigo(clase.cod), // fallback por si falta
          grado: factura.estudianteId?.grado || "N/A",
          total: factura.total,
          tipoPago: factura.tipoPago,
          mes: mesFactura,
          dia: clase.dia,
          hora: clase.hora,
        });
      });
    });

    if (Object.keys(agrupado).length === 0) {
      alert("No hay datos para el mes seleccionado.");
      return;
    }

    const content = [];

    content.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "COLEGIO PANAMERICANO COLOMBOSUECO",
            bold: true,
            size: 30,
          }),
        ],
        spacing: { after: 300 },
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "Informe general de venta Clases Extracurriculares",
            size: 26,
          }),
        ],
        spacing: { after: 200 },
      }),
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            text: `Mes: ${mesSeleccionado}`,
            bold: true,
            size: 24,
          }),
        ],
        spacing: { after: 200 },
      }),
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({ text: "Elaborado por: LINA MARIA HOYOS", size: 22 }),
        ],
        spacing: { after: 300 },
      })
    );

    let totalNominaGlobal = 0;
    let totalDatafonoGlobal = 0;
    let totalEfectivoGlobal = 0;
    let totalGlobal = 0;

    Object.entries(agrupado).forEach(([cod, items]) => {
      // Ordenar por tipo de pago
      items.sort((a, b) =>
        a.tipoPago
          .trim()
          .toLowerCase()
          .localeCompare(b.tipoPago.trim().toLowerCase())
      );

      content.push(
        new Paragraph({
          text: getNombreCodigo(cod),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
        })
      );

      const tablaDatos = new Table({
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
        rows: [
          new TableRow({
            tableHeader: true,
            children: ["Estudiante", "Clase", "Grado", "Día", "Hora"].map(
              (text) =>
                new TableCell({
                  children: [new Paragraph({ text })],
                  shading: { fill: "#f4f2f2" },
                })
            ),
          }),
          ...items.map(
            (item) =>
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(item.estudiante)] }),
                  new TableCell({
                    children: [new Paragraph(item.nombreClase)],
                  }),
                  new TableCell({ children: [new Paragraph(item.grado)] }),
                  new TableCell({ children: [new Paragraph(item.dia)] }),
                  new TableCell({ children: [new Paragraph(item.hora)] }),
                ],
              })
          ),
        ],
      });

      content.push(tablaDatos);

      // Subtotales por clase
      let subtotalNomina = 0;
      let subtotalDatafono = 0;
      let subtotalEfectivo = 0;

      items.forEach((item) => {
        if (item.tipoPago === "Nómina") subtotalNomina += item.total;
        else if (item.tipoPago === "Datáfono") subtotalDatafono += item.total;
        else if (item.tipoPago === "Efectivo") subtotalEfectivo += item.total;
      });

      const totalGeneral = subtotalNomina + subtotalDatafono + subtotalEfectivo;

      // Acumuladores globales
      totalNominaGlobal += subtotalNomina;
      totalDatafonoGlobal += subtotalDatafono;
      totalEfectivoGlobal += subtotalEfectivo;
      totalGlobal += totalGeneral;
    });

    const doc = new Document({
      sections: [{ children: content }],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `Informe_extra_clases_${mesSeleccionado}.docx`);
    });
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
                <option value="">-- Seleccionar Mes --</option>
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
                onClick={generarInformeWord}
              >
                Generar Informe
              </button>
            </li>
          </ul>
        </div>
      </header>

      <KPIsExtraClases
        data={facturasFiltradas.filter((factura) => {
          const mesFactura = new Date(factura.fechaCompra).toLocaleString(
            "es-ES",
            { month: "long" }
          );
          return mesFactura.toLowerCase() === mesSeleccionado.toLowerCase();
        })}
      />
    </div>
  );
};

export default InformeExtraClasesDec;
