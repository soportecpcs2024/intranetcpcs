import React, { useEffect, useState } from "react";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  ImageRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { useActasDeGrado } from "../../../contexts/ActasDeGradoContext";

const getImageBufferFromPublic = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return await blob.arrayBuffer();
};

const GenerarTodasActas = () => {
  const { estudiantes, listarEstudiantes } = useActasDeGrado();
  const [generando, setGenerando] = useState(false);

  const fechaActual = new Date();
  const dia = fechaActual.getDate();
  const mes = fechaActual.toLocaleString("es-CO", { month: "long" });
  const año = fechaActual.getFullYear();

  useEffect(() => {
    listarEstudiantes();
  }, []);

  const generarActaParaEstudiante = async (estudiante, imageBuffer) => {
    // 🔹 Función para abreviar el tipo de documento
  const getAbreviaturaDocumento = (tipo) => {
    if (!tipo) return "";
    const normalizado = tipo.toLowerCase().trim();
    if (normalizado.includes("tarjeta")) return "T.I.";
    if (normalizado.includes("cedula") || normalizado.includes("cédula")) return "C.C.";
    return tipo; // Si no coincide, se deja el valor original
  };

  const tipoDocumento = getAbreviaturaDocumento(estudiante.identificacion);
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 },
              children: [
                new ImageRun({
                  data: imageBuffer,
                  transformation: { width: 120, height: 120 },
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text:"COLEGIO PANAMERICANO COLOMBO SUECO FILIAL DE LA MISIÓN PANAMERICANA DE COLOMBIA. ESTABLECIMIENTO PRIVADO DE CARÁCTER FORMAL APROBADO CON RESOLUCIÓN PARA PREESCOLAR 009070 DESDE EL 14 DE SEPTIEMBRE DE 1994, PARA BÁSICA PRIMARIA Y SECUNDARIA 00108 DESDE EL 26 DE MARZO DE 1996, Y PARA EL NIVEL DE MEDIA ACADÉMICA 4104 DESDE EL 22 DE MAYO DE 2001, EMANADAS DE LA SECRETARÍA DE EDUCACIÓN Y CULTURA DE ANTIOQUIA.",
                  bold: true,
                  size: 22,
                }),
              ],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 300 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "ACTA INDIVIDUAL DE GRADUACIÓN",
                  bold: true,
                  italic: true,
                  size: 30,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { before: 400, after: 400 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `En la ciudad de Medellín, el día 27 de noviembre del año 2025, se realizó el acto de graduación de los estudiantes que finalizaron el programa correspondiente al nivel de educación media académica, según lo dispuesto por la Ley 115 de 1994 y reglamentado en el Decreto 1860 de 1994 del Ministerio de Educación Nacional y el Decreto 1290 de 2009. Se otorgó a:"`,
                  size: 26,
                }),
              ],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 400 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${estudiante.primer_nombre} ${estudiante.segundo_nombre || ""} ${estudiante.primer_apellido} ${estudiante.segundo_apellido || ""}`,
                  bold: true,
                  size: 32,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Identificado con ${tipoDocumento} ${estudiante.num_identificacion} expedida en ${estudiante.expedicion_docum}, quien cursó y aprobó los estudios correspondientes al nivel de educación media académica.`,
                  size: 26,
                }),
              ],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 300 },
            }),
            new Paragraph({
              children: [new TextRun({ text: "El título de:", size: 24 })],
              alignment: AlignmentType.CENTER,
              spacing: { before: 400, after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "BACHILLER ACADÉMICO",
                  bold: true,
                  size: 34,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text:`Registrado para efectos legales de conformidad con el Decreto número 921 del 6 de mayo de 1994 en el libro de actas de grado número ${estudiante.acta}, folio ${estudiante.folio}, número de orden ${estudiante.orden}.`,
                  size: 26,
                }),
              ],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 300 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Para constancia se firma en Medellín a los ${dia} días del mes de ${mes} de ${año}.`,
                  size: 26,
                }),
              ],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 2000 },
            }),
            // Tabla de firmas
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      borders: { top: { color: "FFFFFF" }, bottom: { color: "FFFFFF" }, left: { color: "FFFFFF" }, right: { color: "FFFFFF" } },
                      children: [new Paragraph({ children: [new TextRun({ text: "EDGAR GONZÁLEZ FUENTES", bold: true, size: 24 })], alignment: AlignmentType.CENTER })],
                    }),
                    new TableCell({
                      borders: { top: { color: "FFFFFF" }, bottom: { color: "FFFFFF" }, left: { color: "FFFFFF" }, right: { color: "FFFFFF" } },
                      children: [new Paragraph({ children: [new TextRun({ text: "LUZ MIRIAM BOTERO ZAVALA", bold: true, size: 24 })], alignment: AlignmentType.CENTER })],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      borders: { top: { color: "FFFFFF" }, bottom: { color: "FFFFFF" }, left: { color: "FFFFFF" }, right: { color: "FFFFFF" } },
                      children: [new Paragraph({ children: [new TextRun({ text: "C.C. 16.678.768 de Cali", size: 24 })], alignment: AlignmentType.CENTER })],
                    }),
                    new TableCell({
                      borders: { top: { color: "FFFFFF" }, bottom: { color: "FFFFFF" }, left: { color: "FFFFFF" }, right: { color: "FFFFFF" } },
                      children: [new Paragraph({ children: [new TextRun({ text: "C.C. 43.208.497 de Medellín", size: 24 })], alignment: AlignmentType.CENTER })],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      borders: { top: { color: "FFFFFF" }, bottom: { color: "FFFFFF" }, left: { color: "FFFFFF" }, right: { color: "FFFFFF" } },
                      children: [new Paragraph({ children: [new TextRun({ text: "Rector", size: 24 })], alignment: AlignmentType.CENTER })],
                    }),
                    new TableCell({
                      borders: { top: { color: "FFFFFF" }, bottom: { color: "FFFFFF" }, left: { color: "FFFFFF" }, right: { color: "FFFFFF" } },
                      children: [new Paragraph({ children: [new TextRun({ text: "Secretaria Académica", size: 24 })], alignment: AlignmentType.CENTER })],
                    }),
                  ],
                }),
              ],
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    return {
      nombre: `${estudiante.primer_apellido}_${estudiante.primer_nombre}_Acta.docx`,
      blob,
    };
  };

  const generarTodas = async () => {
    if (!estudiantes || estudiantes.length === 0) return;

    setGenerando(true);
    const zip = new JSZip();
    const imageBuffer = await getImageBufferFromPublic("/LOGOED.jpg");

    for (const estudiante of estudiantes) {
      const { nombre, blob } = await generarActaParaEstudiante(estudiante, imageBuffer);
      zip.file(nombre, blob);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `Actas_Graduacion_${año}.zip`);
    setGenerando(false);
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "600px", margin: "auto" }}>
      <h3>Generar todas las actas de grado</h3>
      <button
        onClick={generarTodas}
        disabled={generando}
        style={{
          padding: "10px 20px",
          backgroundColor: generando ? "#ccc" : "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: generando ? "not-allowed" : "pointer",
        }}
      >
        {generando ? "Generando..." : "Generar ZIP de Actas"}
      </button>
    </div>
  );
};

export default GenerarTodasActas;
