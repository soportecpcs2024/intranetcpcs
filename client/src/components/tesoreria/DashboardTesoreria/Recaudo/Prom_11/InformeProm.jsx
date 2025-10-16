import { useState, useEffect } from "react";
import { useRecaudo } from "../../../../../contexts/RecaudoContext";
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

const InformeProm = () => {
  const [mesSeleccionado, setMesSeleccionado] = useState("");
  const { facturas } = useRecaudo();
  const [facturasFiltradas, setFacturasFiltradas] = useState([]);
 

  useEffect(() => {
    if (facturas.length > 0) {
      const codValidos = [
        
        "2100",
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
      
      case "2100":
        return "Prom 11";

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
            text: "Informe general de venta PROM",
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
            children: [
              "Estudiante",
              "Clase",
              "Grado",
              "Total",
              "Tipo de pago",
            ].map(
              (text) =>
                new TableCell({
                  children: [new Paragraph({ text })],
                  shading: { fill: "#f4f2f2" },
                })
            ),
          }),
          ...items.map((item) =>
  new TableRow({
    children: [
      new TableCell({ children: [new Paragraph(item.estudiante)] }),
      new TableCell({ children: [new Paragraph(item.nombreClase)] }),
      new TableCell({ children: [new Paragraph(item.grado)] }),
      new TableCell({
        children: [new Paragraph(`$ ${item.total.toLocaleString()}`)],
      }),
      new TableCell({
        children: [new Paragraph(item.tipoPago)],
        shading: {
          fill:
            item.tipoPago === "Nómina"
              ? "C6EFCE"
              : item.tipoPago === "Efectivo"
              ? "FFEB9C"
              : item.tipoPago === "Datáfono"
              ? "D9E1F2"
              : "FFFFFF",
        },
      }),
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
                children: [
                  new Paragraph({ text: "TOTAL GENERAL:", bold: true }),
                ],
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
      saveAs(blob, `Informe_PROM_${mesSeleccionado}.docx`);
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
    </div>
  );
};


export default InformeProm;
