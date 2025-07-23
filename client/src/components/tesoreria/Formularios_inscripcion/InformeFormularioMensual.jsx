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

const InformeFormularioMensual = () => {
  const [data, setData] = useState([]);
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth());

  const apiBaseUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    axios.get(`${apiBaseUrl}/api/preinscripciones`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  const filtrarPorMes = () => {
    return data.filter(f => {
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
      const tipo = item.tipoFormulario;
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

    let totalGeneral = 0;
    let totalNominaGlobal = 0;
    let totalEfectivoGlobal = 0;
    let totalDatafonoGlobal = 0;

    for (const [tipoFormulario, registros] of Object.entries(agrupado)) {
      let subtotalNomina = 0, subtotalEfectivo = 0, subtotalDatafono = 0;

      children.push(
        new Paragraph({
          text: `Tipo de formulario: ${tipoFormulario}`,
          bold: true,
          spacing: { after: 100 },
        })
      );

      const tableRows = [
        new TableRow({
          children: ["N°", "Nombre", "Grado", "Costo", "Tipo Pago"].map((txt, i) =>
            new TableCell({
              children: [new Paragraph({ text: txt, bold: true })],
              width: { size: i === 1 ? 30 : 20, type: WidthType.PERCENTAGE },
              shading: { fill: "#f4f2f2" },
            })
          )
        }),
      ];

      registros.forEach((item, idx) => {
        if (item.tipoPago === "Nómina") subtotalNomina += item.costo;
        if (item.tipoPago === "Efectivo") subtotalEfectivo += item.costo;
        if (item.tipoPago === "Datáfono") subtotalDatafono += item.costo;

        totalGeneral += item.costo;

        tableRows.push(
          new TableRow({
            children: [
              (idx + 1).toString(),
              item.nombreEstudiante,
              item.gradoPostula,
              new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP"
              }).format(item.costo),
              item.tipoPago
            ].map((txt, i) =>
              new TableCell({
                children: [new Paragraph({ text: txt.toString() })],
                width: { size: i === 1 ? 30 : 20, type: WidthType.PERCENTAGE },
              })
            )
          })
        );
      });

      children.push(new Table({
        rows: tableRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
      }));

      children.push(
        new Paragraph({ text: `Subtotal Nómina: ${subtotalNomina.toLocaleString("es-CO")}`, spacing: { before: 200 } }),
        new Paragraph({ text: `Subtotal Efectivo: ${subtotalEfectivo.toLocaleString("es-CO")}` }),
        new Paragraph({ text: `Subtotal Datáfono: ${subtotalDatafono.toLocaleString("es-CO")}` }),
        new Paragraph({ text: "" })
      );

      totalNominaGlobal += subtotalNomina;
      totalEfectivoGlobal += subtotalEfectivo;
      totalDatafonoGlobal += subtotalDatafono;
    }

    // Resumen global final
    children.push(
      new Paragraph({
        text: "Resumen Final General",
        spacing: { before: 400, after: 100 },
        bold: true,
      }),
      new Table({
        width: { size: 50, type: WidthType.PERCENTAGE },
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
              new TableCell({ children: [new Paragraph("Total Nómina:")] }),
              new TableCell({
                children: [new Paragraph(`$ ${totalNominaGlobal.toLocaleString("es-CO")}`)],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Total Efectivo:")] }),
              new TableCell({
                children: [new Paragraph(`$ ${totalEfectivoGlobal.toLocaleString("es-CO")}`)],
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph("Total Datáfono:")] }),
              new TableCell({
                children: [new Paragraph(`$ ${totalDatafonoGlobal.toLocaleString("es-CO")}`)],
              }),
            ],
          }),
        ],
      }),
      new Paragraph({
        text: `TOTAL GENERAL: $ ${totalGeneral.toLocaleString("es-CO")}`,
        bold: true,
        spacing: { before: 300 },
      })
    );

    const doc = new Document({ sections: [{ children }] });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Informe_${meses[mesSeleccionado]}.docx`);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Generar Informe Mensual de formularios:</h2>
      <p className="informe-formularios">¡Selecciona el mes y da clic en generar informe!</p>

      <select value={mesSeleccionado} onChange={(e) => setMesSeleccionado(e.target.value)}>
        {meses.map((mes, idx) => (
          <option key={idx} value={idx}>{mes}</option>
        ))}
      </select>

      <button onClick={agruparYExportar} style={{ marginLeft: "1rem" }}>
        Generar informe
      </button>
    </div>
  );
};

export default InformeFormularioMensual;
