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

const InformePromAdm = () => {
  const [mesSeleccionado, setMesSeleccionado] = useState("");
  const { facturas } = useRecaudo();
  const [facturasFiltradas, setFacturasFiltradas] = useState([]);

  useEffect(() => {
    if (facturas.length > 0) {
      const codValidos = ["2100"];

      const nuevasFacturas = facturas
        .filter((factura) =>
          factura.clases?.some((clase) => codValidos.includes(clase.cod?.toString()))
        )
        .map((factura) => ({
          ...factura,
          nombreEstudiante: factura.estudianteId?.nombre?.trim() || "Desconocido",
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

    // Agrupación principal: grado -> cod -> items
    const agrupadoPorGrado = {};

    facturasFiltradas.forEach((factura) => {
      const fecha = new Date(factura.fechaCompra);
      const mesFactura = fecha.toLocaleString("es-ES", { month: "long" });

      if (mesFactura.toLowerCase() !== mesSeleccionado.toLowerCase()) return;

      const grado = factura.estudianteId?.grado?.trim().toUpperCase() || "SIN GRADO";
      if (!agrupadoPorGrado[grado]) agrupadoPorGrado[grado] = {};

      factura.clases.forEach((clase) => {
        const cod = clase.cod?.toString();
        if (!cod) return;

        if (!agrupadoPorGrado[grado][cod]) agrupadoPorGrado[grado][cod] = [];

        // ✅ Ya NO guardamos total/tipoPago (dinero)
        agrupadoPorGrado[grado][cod].push({
          estudiante: factura.estudianteId?.nombre || "N/A",
          nombreClase: clase.nombreClase || getNombreCodigo(cod),
          grado,
          mes: mesFactura,
        });
      });
    });

    if (Object.keys(agrupadoPorGrado).length === 0) {
      alert("No hay datos para el mes seleccionado.");
      return;
    }

    const content = [];

    // Encabezado principal
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
        children: [new TextRun({ text: "Informe general de venta PROM", size: 26 })],
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
        children: [new TextRun({ text: "Elaborado por: LINA MARIA HOYOS", size: 22 })],
        spacing: { after: 300 },
      })
    );

    // ✅ Total global solo por conteo
    let totalGlobalRegistros = 0;

    // Orden predefinido de grados
    const ordenGrados = ["ONCE A", "ONCE B", "DECIMO A", "DECIMO B"];

    ordenGrados.forEach((grado) => {
      const clasesPorGrado = agrupadoPorGrado[grado];
      if (!clasesPorGrado) return;

      content.push(
        new Paragraph({
          text: `Grado ${grado}`,
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 600, after: 300 },
        })
      );

      Object.entries(clasesPorGrado).forEach(([cod, items]) => {
        content.push(
          new Paragraph({
            text: getNombreCodigo(cod),
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          })
        );

        // ✅ Tabla SIN dinero, con columna # para conteo visible
        const tablaDatos = new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              tableHeader: true,
              children: ["#", "Estudiante", "Clase", "Grado"].map((text) => (
                new TableCell({
                  children: [new Paragraph({ text })],
                  shading: { fill: "#f4f2f2" },
                })
              )),
            }),
            ...items.map((item, idx) => (
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(String(idx + 1))] }),
                  new TableCell({ children: [new Paragraph(item.estudiante)] }),
                  new TableCell({ children: [new Paragraph(item.nombreClase)] }),
                  new TableCell({ children: [new Paragraph(item.grado)] }),
                ],
              })
            )),
          ],
        });

        content.push(tablaDatos);

        // ✅ Resumen por bloque: conteo
        const totalBloque = items.length;
        totalGlobalRegistros += totalBloque;

        const resumenConteo = new Table({
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
          },
          width: { size: 45, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: "Total de registros en este ítem:",
                          bold: true,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: String(totalBloque),
                          bold: true,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        });

        content.push(new Paragraph({ text: "" }), resumenConteo);
      });
    });

    // ✅ Resumen Final Global (solo conteo)
    content.push(
      new Paragraph({ text: "", spacing: { before: 400 } }),
      new Paragraph({
        text: "Resumen Final General (Conteo)",
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
        width: { size: 55, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Total general de registros del mes:",
                        bold: true,
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: String(totalGlobalRegistros),
                        bold: true,
                      }),
                    ],
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
              <button className="informe-item btn-excel" onClick={generarInformeWord}>
                Generar Informe
              </button>
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
};

export default InformePromAdm;
