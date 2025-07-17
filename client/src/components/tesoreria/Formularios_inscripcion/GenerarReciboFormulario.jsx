import React from "react";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  PageSize,
  BorderStyle,
  AlignmentType,
  VerticalAlign,
  ImageRun,
} from "docx";
import { saveAs } from "file-saver";

const GenerarReciboFormulario = ({ data, onDescargar }) => {
  const handleDownload = async () => {
    try {
      // Obtener el logo desde public
      const response = await fetch("/logo2025.png");
      const imageBlob = await response.blob();
      const imageArrayBuffer = await imageBlob.arrayBuffer();
      const imageUint8Array = new Uint8Array(imageArrayBuffer);

      const doc = new Document({
        sections: [
          {
            properties: {
              pageSize: {
                width: PageSize.A4_WIDTH,
                height: PageSize.A4_HEIGHT,
              },
            },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "COLEGIO PANAMERICANO COLOMBOSUECO",
                    bold: true,
                    size: 26,
                    font: "Arial",
                  }),
                ],
                spacing: { after: 200 },
              }),

              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.NONE },
                  bottom: { style: BorderStyle.NONE },
                  left: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE },
                  insideVertical: { style: BorderStyle.NONE },
                },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: "RECIBO DE COMPRA DE FORMULARIO",
                                bold: true,
                                size: 24,
                                font: "Arial",
                              }),
                              new TextRun({ break: 1 }),
                              new TextRun({
                                text: `Fecha: ${new Date(data.fechaCompraFormulario).toLocaleDateString("es-ES")}`,
                                size: 20,
                                font: "Arial",
                              }),
                            ],
                          }),
                        ],
                        width: { size: 70, type: WidthType.PERCENTAGE },
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            children: [
                              new ImageRun({
                                data: imageUint8Array,
                                transformation: {
                                  width: 70,
                                  height: 70,
                                },
                              }),
                            ],
                          }),
                        ],
                        width: { size: 30, type: WidthType.PERCENTAGE },
                      }),
                    ],
                  }),
                ],
              }),

              new Paragraph({
                spacing: { before: 300, after: 100 },
                children: [
                  new TextRun({ text: "Nombre del estudiante: ", bold: true, size: 22 }),
                  new TextRun({ text: data.nombreEstudiante, size: 22 }),
                ],
              }),
              new Paragraph({
                spacing: { after: 100 },
                children: [
                  new TextRun({ text: "Documento de identidad: ", bold: true, size: 22 }),
                  new TextRun({ text: data.numeroDocumento, size: 22 }),
                ],
              }),
              new Paragraph({
                spacing: { after: 100 },
                children: [
                  new TextRun({ text: "Grado al que postula: ", bold: true, size: 22 }),
                  new TextRun({ text: data.gradoPostula, size: 22 }),
                ],
              }),
              new Paragraph({
                spacing: { after: 100 },
                children: [
                  new TextRun({ text: "Tipo de formulario: ", bold: true, size: 22 }),
                  new TextRun({ text: data.tipoFormulario, size: 22 }),
                ],
              }),

              new Paragraph({
                spacing: { before: 400, after: 100 },
                children: [
                  new TextRun({
                    text: "Medio de pago: ",
                    bold: true,
                    size: 20,
                  }),
                  new TextRun({
                    text: `${data?.tipoPago || "N/A"}`,
                    size: 20,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { after: 300 },
                children: [
                  new TextRun({ text: "Costo: ", bold: true, size: 22 }),
                  new TextRun({
                    text: new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                    }).format(data.costo || 0),
                    size: 28,
                    bold: true,
                  }),
                ],
              }),

              new Paragraph({
                alignment: AlignmentType.RIGHT,
                text: `Registrado por: Lina María Hoyos Restrepo`,
                spacing: { after: 100 },
                verticalAlign: VerticalAlign.CENTER,
                bold: true,
              }),

              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 200 },
                children: [
                  new TextRun({
                    text: "FILIAL DE LA MISIÓN PANAMERICANA DE COLOMBIA - FUNDADO EN 1994",
                    size: 14,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "PERSONERÍA JURÍDICA ESPECIAL 867 DE 1996",
                    size: 14,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "NIT: 860.007.390-1",
                    size: 14,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "__________________________________________________________",
                    size: 12,
                  }),
                ],
                spacing: { before: 200 },
              }),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `Recibo_${data.nombreEstudiante}.docx`);

      // ✅ Ocultar el botón tras la descarga
      if (onDescargar) {
        onDescargar();
      }
    } catch (error) {
      console.error("Error al generar el recibo:", error);
    }
  };

  return (
    <button onClick={handleDownload}>
      Descargar Recibo
    </button>
  );
};

export default GenerarReciboFormulario;
