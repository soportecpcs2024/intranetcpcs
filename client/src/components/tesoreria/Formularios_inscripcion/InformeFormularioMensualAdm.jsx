import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType,
  BorderStyle,
} from "docx";
import { saveAs } from "file-saver";

const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const InformeFormularioMensualAdm = () => {
  const [data, setData] = useState([]);
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth());

  const apiBaseUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    axios.get(`${apiBaseUrl}/api/preinscripciones`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, [apiBaseUrl]);

  const filtrarPorMes = () => {
    return data.filter((f) => {
      const fecha = new Date(f.fechaCompraFormulario);
      return fecha.getMonth() === parseInt(mesSeleccionado);
    });
  };

  const agruparYExportar = async () => {
    const datosFiltrados = filtrarPorMes();

    if (datosFiltrados.length === 0) {
      alert("No hay registros para este mes.");
      return;
    }

    const agrupado = {};
    datosFiltrados.forEach((item) => {
      const tipo = item.tipoFormulario || "SIN TIPO";
      if (!agrupado[tipo]) agrupado[tipo] = [];
      agrupado[tipo].push(item);
    });

    const children = [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: "COLEGIO PANAMERICANO COLOMBOSUECO", bold: true, size: 30 }),
        ],
        spacing: { after: 300 },
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: "Informe general de venta de formularios", size: 26 }),
        ],
        spacing: { after: 200 },
      }),
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({ text: `Mes: ${meses[mesSeleccionado]}`, bold: true, size: 24 }),
        ],
        spacing: { after: 200 },
      }),
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({ text: "Elaborado por: LINA MARIA HOYOS", size: 22 }),
        ],
        spacing: { after: 300 },
      }),
    ];

    // ✅ Total global solo por conteo
    let totalGlobalRegistros = 0;

    for (const [tipoFormulario, registros] of Object.entries(agrupado)) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Tipo de formulario: ${tipoFormulario}`, bold: true }),
          ],
          spacing: { before: 200, after: 100 },
        })
      );

      // ✅ Tabla sin costo / tipo pago
      const tableRows = [
        new TableRow({
          children: ["#", "Nombre", "Grado"].map((txt, i) => (
            new TableCell({
              children: [new Paragraph({ text: txt, bold: true })],
              width: { size: i === 1 ? 50 : 25, type: WidthType.PERCENTAGE },
              shading: { fill: "#f4f2f2" },
            })
          )),
        }),
      ];

      registros.forEach((item, idx) => {
        tableRows.push(
          new TableRow({
            children: [
              (idx + 1).toString(),
              item.nombreEstudiante || "N/A",
              item.gradoPostula || "N/A",
            ].map((txt, i) => (
              new TableCell({
                children: [new Paragraph({ text: String(txt) })],
                width: { size: i === 1 ? 50 : 25, type: WidthType.PERCENTAGE },
              })
            )),
          })
        );
      });

      children.push(
        new Table({
          rows: tableRows,
          width: { size: 100, type: WidthType.PERCENTAGE },
        })
      );

      // ✅ Resumen por tipo: conteo
      const totalTipo = registros.length;
      totalGlobalRegistros += totalTipo;

      children.push(
        new Table({
          width: { size: 55, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Total de registros en este tipo:", bold: true })] })],
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: String(totalTipo), bold: true })] })],
                }),
              ],
            }),
          ],
        }),
        new Paragraph({ text: "" })
      );
    }

    // ✅ Resumen global final (solo conteo)
    children.push(
      new Paragraph({
        children: [new TextRun({ text: "Resumen Final General (Conteo)", bold: true })],
        spacing: { before: 400, after: 150 },
      }),
      new Table({
        width: { size: 55, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: "Total general de registros del mes:", bold: true })] })],
              }),
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: String(totalGlobalRegistros), bold: true })] })],
              }),
            ],
          }),
        ],
      })
    );

    const doc = new Document({ sections: [{ children }] });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Informe_Formularios_${meses[mesSeleccionado]}.docx`);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Generar Informe Mensual de formularios:</h2>
      <p className="informe-formularios">
        ¡Selecciona el mes y da clic en generar informe!
      </p>

      <select
        value={mesSeleccionado}
        onChange={(e) => setMesSeleccionado(e.target.value)}
      >
        {meses.map((mes, idx) => (
          <option key={idx} value={idx}>
            {mes}
          </option>
        ))}
      </select>

      <button onClick={agruparYExportar} style={{ marginLeft: "1rem" }}>
        Generar informe
      </button>
    </div>
  );
};

export default InformeFormularioMensualAdm;
