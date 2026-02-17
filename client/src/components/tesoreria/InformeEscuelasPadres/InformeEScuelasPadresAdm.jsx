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

const GenerarWordAdm = () => {
  const [mesSeleccionado, setMesSeleccionado] = useState("");
  const { facturas } = useRecaudo();
  const [facturasFiltradas, setFacturasFiltradas] = useState([]);

  useEffect(() => {
    if (facturas.length > 0) {
      const codValidos = ["1300", "1400", "1600", "1700"];

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

    facturasFiltradas.forEach((factura) => {
      const fecha = new Date(factura.fechaCompra);
      const mesFactura = fecha.toLocaleString("es-ES", { month: "long" });

      if (mesFactura.toLowerCase() !== mesSeleccionado.toLowerCase()) return;

      factura.clases.forEach((clase) => {
        const cod = clase.cod?.toString();
        if (!cod) return;

        if (!agrupado[cod]) agrupado[cod] = [];

        // ✅ Ya NO guardamos total/tipoPago (dinero)
        agrupado[cod].push({
          estudiante: factura.estudianteId?.nombre || "N/A",
          grado: factura.estudianteId?.grado || "N/A",
          mes: mesFactura,
        });
      });
    });

    if (Object.keys(agrupado).length === 0) {
      alert("No hay datos para el mes seleccionado.");
      return;
    }

    const content = [];

    // Encabezado
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
            text: "Informe general de venta de Escuelas de Padres",
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

    // ✅ Total global de registros (conteo)
    let totalGlobalRegistros = 0;

    Object.entries(agrupado).forEach(([cod, items]) => {
      content.push(
        new Paragraph({
          text: getNombreCodigo(cod),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
        })
      );

      // ✅ Tabla con columna # (conteo visible) y SIN dinero
      const tablaDatos = new Table({
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
        rows: [
          new TableRow({
            tableHeader: true,
            children: ["#", "Estudiante", "Grado"].map((text) => (
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
                new TableCell({ children: [new Paragraph(item.grado)] }),
              ],
            })
          )),
        ],
      });

      content.push(tablaDatos);

      // ✅ Resumen por ítem/código: número de registros
      const totalItem = items.length;
      totalGlobalRegistros += totalItem;

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
                        text: String(totalItem),
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

    // ✅ Resumen final global (solo conteo)
    content.push(
      new Paragraph({
        text: "",
        spacing: { before: 400 },
      }),
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
      saveAs(blob, `Informe_Escuelas_Padres_${mesSeleccionado}.docx`);
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

export default GenerarWordAdm;
