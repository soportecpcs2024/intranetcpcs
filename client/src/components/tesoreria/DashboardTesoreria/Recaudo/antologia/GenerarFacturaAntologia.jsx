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

const GenerarFacturaAntologia = ({ factura, estudiante, setEstudiantedata }) => {
  const fechaCompra = factura?.fechaCompra || "N/A";

 

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
      const response = await fetch("/logoed.png"); // Asegúrate de que el logo esté en 'public/logo.png'
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
                    text: estudiante?.nombre || "N/A", // Este texto no estará en negrita
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
                    text: estudiante?.documentoIdentidad || "N/A", // Este texto no estará en negrita
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
                    text: estudiante.grado || "N/A", // Este texto no estará en negrita
                    size: 18,
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



              // Tabla de clases
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: "Descripción",
                                bold: true,
                                size: 20,
                              }),
                            ],
                          }),
                        ],
                        verticalAlign: VerticalAlign.CENTER,
                        margins: {
                          top: 70,
                          bottom: 70,
                          left: 70,
                          right: 70,
                        },
                        shading: { fill: "#f4f2f2" },
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: "COSTO",
                                bold: true,
                                size: 20,
                              }),
                            ],
                          }),
                        ],
                        verticalAlign: VerticalAlign.CENTER,
                        margins: {
                          top: 70,
                          bottom: 70,
                          left: 70,
                          right: 70,
                        },
                        shading: { fill: "#f4f2f2" },
                      }),
                    ],
                  }),


                  ...(factura?.clases || []).map(
                    (clase) =>
                      new TableRow({
                        children: [
                          new TableCell({
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text: `${clase.nombreClase} `,
                                    bold: true, // Puedes quitarlo si no quieres negrita
                                    size: 20,
                                  }),
                                  
                                ],
                              }),
                            ],
                            
                            verticalAlign: VerticalAlign.CENTER,
                            margins: {
                              top: 100,
                              bottom: 100,
                              left: 100,
                              right: 100,
                            },
                          }),

                          new TableCell({
                            children: [
                              new Paragraph(
                                new Intl.NumberFormat("es-CO", {
                                  style: "currency",
                                  currency: "COP",
                                  minimumFractionDigits: 2,
                                }).format(clase.costo || 0)
                              ),
                            ],
                            margins: {
                              top: 100,
                              bottom: 100,
                              left: 100,
                              right: 100,
                            },
                          }),
                        ],
                      })
                  ),
                ],
              }),

              new Paragraph({
                spacing: { before: 200, after: 10 },
                children: [
                  new TextRun({
                    text: "Medio de pago: ",
                    bold: true, // Solo este texto estará en negrita
                    size: 20,
                  }),
                  new TextRun({
                    text: `${factura?.tipoPago || "N/A"}`, // Este texto no estará en negrita
                    size: 20,
                  }),
                ],
              }),

              

              new Paragraph({
                alignment: AlignmentType.RIGHT,
                
                children: [
                  new TextRun({
                    text: `Total: ${new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 2,
                    }).format(factura?.total || 0)}`,
                    bold: true,
                    size: 28,
                  }),
                ],
                spacing: { before: 200, after: 300 },
              }),

              new Paragraph({
                alignment: AlignmentType.RIGHT,
                text: `Registrado por: ${factura?.nombreRegistrador || "N/A"}`,
                spacing: { after: 100 },
                verticalAlign: VerticalAlign.CENTER,
                bold: true,
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
        `Factura_${estudiante.nombre || "SinNombre"}.docx`,
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

export default GenerarFacturaAntologia;
