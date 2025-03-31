import React from "react";
import { saveAs } from "file-saver";
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
} from "docx";
import { ImageRun } from "docx";

const GenerarFacturaAlmuerzos = ({ ultimafactura }) => {
    console.log("Última Factura: ", ultimafactura); // Aquí sí mostrará el valor actualizado
  const fechaCompra = ultimafactura?.fechaCompra || "N/A";

  const fechaFormateada =
    fechaCompra !== "N/A"
      ? new Date(fechaCompra).toLocaleDateString("es-ES")
      : "N/A";

      

  const handleDownload = async () => {

    
    try {
      if (!factura) {
        console.error("No hay datos de factura.");
        return;
      }

      // Cargar la imagen desde el directorio público
      const response = await fetch("../../../../../../public/logo2025.png"); // Asegúrate de que el logo esté en 'public/logo.png'
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
                    size: 25,
                    font: "Arial",

                  }),
                ],
                spacing: { after: 100 },
              }),
              // Cabecera con título y fecha
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
                            spacing: { before: 0, after: 20 },
                            children: [
                              new TextRun({
                                text: "RECIBO DE PAGO",
                                bold: true,
                                size: 20,
                                font: "Arial",
                              }),
                              new TextRun({
                                break: 1,
                              }),

                              new TextRun({
                                text: "NÚMERO: ",
                                bold: true, // Solo este texto estará en negrita
                                size: 18,
                                font: "Arial",
                              }),
                              new TextRun({
                                text: `${factura?.numero_factura || "N/A"}`,
                                size: 18,
                                font: "Arial",
                              }),
                              new TextRun({
                                break: 1,
                              }),

                              new TextRun({
                                text: "FECHA: ",
                                bold: true, // Solo este texto estará en negrita
                                size: 18,
                                font: "Arial",
                              }),
                              new TextRun({
                                text: new Date().toLocaleDateString("es-ES"),
                                size: 18,
                                font: "Arial",
                              }),
                            ],
                          }),
                        ],
                        width: { size: 50, type: WidthType.PERCENTAGE },
                      }),

                      new TableCell({
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            children: [
                              new ImageRun({
                                data: imageUint8Array, // Usa la imagen cargada
                                transformation: {
                                  width: 70,
                                  height: 70,
                                },
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),

              new Paragraph({
                spacing: { before: 100, after: 100 },
                children: [
                  new TextRun({
                    text: "Nombre del estudiante: ",
                    bold: true, // Solo este texto estará en negrita
                    size: 20,
                  }),
                  new TextRun({
                    text: estudiante?.estudianteId?.nombre || "N/A", // Este texto no estará en negrita
                    size: 20,
                  }),
                ],
              }),

              new Paragraph({
                spacing: { after: 100 },
                children: [
                  new TextRun({
                    text: "Documento de identidad: ",
                    bold: true, // Solo este texto estará en negrita
                    size: 20,
                  }),
                  new TextRun({
                    text: estudiante?.estudianteId?.documentoIdentidad || "N/A", // Este texto no estará en negrita
                    size: 18,
                  }),
                ],
              }),

              new Paragraph({
                spacing: { after: 100 },
                children: [
                  new TextRun({
                    text: "Grado: ",
                    bold: true, // Solo este texto estará en negrita
                    size: 20,
                  }),
                  new TextRun({
                    text: estudiante?.estudianteId?.grado || "N/A", // Este texto no estará en negrita
                    size: 18,
                  }),
                ],
              }),
              new Paragraph({
                spacing: { after: 100 },
                children: [
                  new TextRun({
                    text: "Mes aplicado: ",
                    bold: true, // Solo este texto estará en negrita
                    size: 20,
                  }),
                  new TextRun({
                    text: factura?.mes_aplicado.toUpperCase() || "N/A", // Este texto no estará en negrita
                    size: 18,
                    caps: true,
                  }),
                ],
              }),



              new Paragraph({
                children: [
                  new TextRun({
                    text: "Servicios seleccionados:",
                    bold: true,
                    size: 25,
                  }),
                ],
                spacing: { before: 200, after: 200 },
              }),



             


              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "FILIAL DE LA MISION PANAMERICANA DE COLOMBIA - FUNDADO EN EL 1994",
                    verticalAlign: VerticalAlign.CENTER,

                    size: 14,
                  }),
                ],
                spacing: { before: 200 },
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "PERSONERIA JURIDICA ESPECIAL 867 DE 1996",
                    verticalAlign: VerticalAlign.CENTER,

                    size: 14,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "NIT.860.007.390-1",
                    verticalAlign: VerticalAlign.CENTER,

                    size: 14,
                  }),
                ],
              }),

              new Paragraph({
                alignment: AlignmentType.CENTER,
                text: `_____________________________________________________________________________________`,
                spacing: { before: 200, after: 100 },
                verticalAlign: VerticalAlign.CENTER,
              }),
            ],
          },
        ],
      });

      

      const blob = await Packer.toBlob(doc);
      saveAs(
        blob,
        `Factura_${estudiante?.estudianteId?.nombre || "SinNombre"}.docx`,
        {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        }
      );
    } catch (error) {
      console.error("Error al generar la factura:", error);
    }
  };

  return <button onClick={handleDownload}>Descargar Factura</button>;
};

export default GenerarFacturaAlmuerzos;
