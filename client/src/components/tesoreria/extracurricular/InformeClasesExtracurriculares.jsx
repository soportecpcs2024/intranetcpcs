import { useState } from "react";
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

const InformeClasesExtracurriculares = () => {
  const { facturas } = useRecaudo();
  const [mesSeleccionado, setMesSeleccionado] = useState("");

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
      case "1000":
        return "Arte";
      case "1100":
        return "Exploración Motriz y Predeportiva Pre";
      case "1300":
        return "Ciberfamilias";
      case "1400":
        return "El arte de ser padres";
      case "1600":
        return "Guiando a sus adolescentes";
      case "1700":
        return "Mayordomía financiera";
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

    facturas.forEach((factura) => {
      const fecha = new Date(factura.fechaCompra);
      const mesFactura = fecha.toLocaleString("es-ES", { month: "long" });

      if (mesFactura.toLowerCase() !== mesSeleccionado.toLowerCase()) return;

      factura.clases.forEach((clase) => {
        const cod = clase.cod;
        if (!agrupado[cod]) agrupado[cod] = [];

        agrupado[cod].push({
          estudiante: factura.estudianteId?.nombre || "N/A",
          grado: factura.estudianteId?.grado || "N/A",
          total: factura.total,
          tipoPago: factura.tipoPago,
          mes: mesFactura,
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
            text: "Informe general de venta extracurriculares y escuelas",
            size: 26,
          }),
        ],
        spacing: { after: 200 },
      }),
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({ text: `Mes: ${mesSeleccionado}`, bold: true, size: 24 }),
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
            children: ["Estudiante", "Grado", "Total", "Tipo de pago"].map(
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
                  new TableCell({ children: [new Paragraph(item.grado)] }),
                  new TableCell({
                    children: [
                      new Paragraph(`$ ${item.total.toLocaleString()}`),
                    ],
                  }),
                  new TableCell({ children: [new Paragraph(item.tipoPago)] }),
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

      const resumen = new Table({
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE },
        },
        width: { size: 30, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph("Subtotal Nómina:")],
              }),
              new TableCell({
                children: [
                  new Paragraph(`$ ${subtotalNomina.toLocaleString()}`),
                ],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph("Subtotal Datáfono:")],
              }),
              new TableCell({
                children: [
                  new Paragraph(`$ ${subtotalDatafono.toLocaleString()}`),
                ],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph("Subtotal Efectivo:")],
              }),
              new TableCell({
                children: [
                  new Paragraph(`$ ${subtotalEfectivo.toLocaleString()}`),
                ],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ text: "TOTAL:", bold: true })],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: `$ ${totalGeneral.toLocaleString()}`,
                    bold: true,
                  }),
                ],
              }),
            ],
          }),
        ],
      });

      content.push(new Paragraph({ text: "" }), resumen);
    });

    // Resumen final global
    content.push(
      new Paragraph({
        text: "",
        spacing: { before: 400 },
      }),
      new Paragraph({
        text: "Resumen Final General",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      }),
      new Table({
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE },
        },
        width: { size: 40, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Total Nómina:")] }),
              new TableCell({
                children: [
                  new Paragraph(`$ ${totalNominaGlobal.toLocaleString()}`),
                ],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Total Datáfono:")] }),
              new TableCell({
                children: [
                  new Paragraph(`$ ${totalDatafonoGlobal.toLocaleString()}`),
                ],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Total Efectivo:")] }),
              new TableCell({
                children: [
                  new Paragraph(`$ ${totalEfectivoGlobal.toLocaleString()}`),
                ],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ text: "TOTAL GENERAL:", bold: true })],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: `$ ${totalGlobal.toLocaleString()}`,
                    bold: true,
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    );

    const doc = new Document({
      sections: [{ children: content }],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `Informe_extra_clase_Esc_padres_${mesSeleccionado}.docx`);
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
                Generar Informe Word
              </button>
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
};

export default InformeClasesExtracurriculares;
