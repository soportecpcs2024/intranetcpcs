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
import { useActasDeGrado } from "../../../contexts/ActasDeGradoContext";

const getImageBufferFromPublic = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return await blob.arrayBuffer();
};

const ActasGrados = () => {
  const { estudiantes, listarEstudiantes, buscarPorIdentificacion, error } =
    useActasDeGrado();
     // 🔹 Función para abreviar el tipo de documento
  const getAbreviaturaDocumento = (tipo) => {
    if (!tipo) return "";
    const normalizado = tipo.toLowerCase().trim();
    if (normalizado.includes("tarjeta")) return "T.I.";
    if (normalizado.includes("cedula") || normalizado.includes("cédula")) return "C.C.";
    return tipo; // Si no coincide, se deja el valor original
  };

   

  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [numDocumento, setNumDocumento] = useState("");
  const [resultadoBusqueda, setResultadoBusqueda] = useState(null);
  const [seleccionado, setSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState("");

  useEffect(() => {
    listarEstudiantes();
  }, []);

  const manejarBusquedaDocumento = async () => {
    if (!numDocumento) {
      setErrorBusqueda("Por favor, ingresa un número de documento.");
      return;
    }

    setLoading(true);
    setErrorBusqueda("");
    try {
      const resultado = await buscarPorIdentificacion(numDocumento);
      if (resultado) {
        setResultadoBusqueda(resultado);
      } else {
        setResultadoBusqueda(null);
        setErrorBusqueda("Estudiante no encontrado.");
      }
    } catch {
      setErrorBusqueda("Hubo un error al realizar la búsqueda.");
    } finally {
      setLoading(false);
    }
  };

  const fechaActual = new Date();

  // Obtener valores dinámicos
  const dia = fechaActual.getDate();
  const mes = fechaActual.toLocaleString("es-CO", { month: "long" }); // "julio"
  const año = fechaActual.getFullYear();

 
  const generarActaWord = async () => {
    // ✅ Abreviatura dinámica según el estudiante seleccionado
  const tipoDocumento = getAbreviaturaDocumento(seleccionado.identificacion);

    if (!seleccionado) return;
    const imageBuffer = await getImageBufferFromPublic("/LOGOED.jpg");

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
                  text: "COLEGIO PANAMERICANO COLOMBO SUECO FILIAL DE LA MISIÓN PANAMERICANA DE COLOMBIA. ESTABLECIMIENTO PRIVADO DE CARÁCTER FORMAL APROBADO CON RESOLUCIÓN PARA PREESCOLAR 009070 DESDE EL 14 DE SEPTIEMBRE DE 1994, PARA BÁSICA PRIMARIA Y SECUNDARIA 00108 DESDE EL 26 DE MARZO DE 1996, Y PARA EL NIVEL DE MEDIA ACADÉMICA 4104 DESDE EL 22 DE MAYO DE 2001, EMANADAS DE LA SECRETARÍA DE EDUCACIÓN Y CULTURA DE ANTIOQUIA.",
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
                  text: "En la ciudad de Medellín, el día 26 de noviembre del año 2026, se realizó el acto de graduación de los estudiantes que finalizaron el programa correspondiente al nivel de educación media académica, según lo dispuesto por la Ley 115 de 1994 y reglamentado en el Decreto 1860 de 1994 del Ministerio de Educación Nacional y el Decreto 1290 de 2009. Se otorgó a:",
                  size: 26,
                }),
              ],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 400 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${seleccionado.primer_nombre} ${
                    seleccionado.segundo_nombre || ""
                  } ${seleccionado.primer_apellido} ${
                    seleccionado.segundo_apellido || ""
                  }`,
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
                  text: `Identificado con ${tipoDocumento} ${seleccionado.num_identificacion} expedida en ${seleccionado.expedicion_docum}, quien cursó y aprobó los estudios correspondientes al nivel de educación media académica.`,
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
                  text: `Registrado para efectos legales de conformidad con el Decreto número 921 del 6 de mayo de 1994 en el libro de actas de grado número ${seleccionado.acta}, folio ${seleccionado.folio}, número de orden ${seleccionado.orden}.`,
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

            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      borders: {
                        top: { color: "FFFFFF" },
                        bottom: { color: "FFFFFF" },
                        left: { color: "FFFFFF" },
                        right: { color: "FFFFFF" },
                      },
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "MARCIA RUTH FINKE TEACHOUT",
                              bold: true,
                              size: 24,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                    }),
                    new TableCell({
                      borders: {
                        top: { color: "FFFFFF" },
                        bottom: { color: "FFFFFF" },
                        left: { color: "FFFFFF" },
                        right: { color: "FFFFFF" },
                      },
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "LUZ MIRIYAM BOTERO ZABALA",
                              bold: true,
                              size: 24,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                     borders: {
                        top: { color: "FFFFFF" },
                        bottom: { color: "FFFFFF" },
                        left: { color: "FFFFFF" },
                        right: { color: "FFFFFF" },
                      },
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "C.C. 42.790.897 de Bogotá",
                              size: 24,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                    }),
                    new TableCell({
                     borders: {
                        top: { color: "FFFFFF" },
                        bottom: { color: "FFFFFF" },
                        left: { color: "FFFFFF" },
                        right: { color: "FFFFFF" },
                      },
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "C.C. 43.208.497 de Medellín",
                              size: 24,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      borders: {
                        top: { color: "FFFFFF" },
                        bottom: { color: "FFFFFF" },
                        left: { color: "FFFFFF" },
                        right: { color: "FFFFFF" },
                      },
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: "Rectora", size: 24 })],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                    }),
                    new TableCell({
                      borders: {
                        top: { color: "FFFFFF" },
                        bottom: { color: "FFFFFF" },
                        left: { color: "FFFFFF" },
                        right: { color: "FFFFFF" },
                      },
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Secretaria Académica",
                              size: 24,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
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
    const nombreArchivo = `${seleccionado.primer_apellido}_${seleccionado.primer_nombre}_Acta_Graduacion.docx`;
    saveAs(blob, nombreArchivo);
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "700px", margin: "auto" }}>
      {/* 🔍 Buscar por documento */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h3>Buscar por número de documento</h3>
        <input
          type="text"
          value={numDocumento}
          onChange={(e) => setNumDocumento(e.target.value)}
          placeholder="Ingresa el número de documento"
          style={{
            padding: "10px",
            width: "100%",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={manejarBusquedaDocumento}
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "10px",
          }}
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>

        {errorBusqueda && <p style={{ color: "red" }}>{errorBusqueda}</p>}

        {resultadoBusqueda && (
          <div
            style={{
              background: "#f8f8f8",
              padding: "1rem",
              borderRadius: "5px",
            }}
          >
            <p>
              <strong>Nombre:</strong> {resultadoBusqueda.primer_nombre}{" "}
              {resultadoBusqueda.segundo_nombre}{" "}
              {resultadoBusqueda.primer_apellido}{" "}
              {resultadoBusqueda.segundo_apellido}
            </p>
            <p>
              <strong>Documento:</strong> {resultadoBusqueda.num_identificacion}
            </p>
            <button
              onClick={() => setSeleccionado(resultadoBusqueda)}
              style={{
                marginTop: "10px",
                padding: "8px 16px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Seleccionar Estudiante
            </button>
          </div>
        )}
      </div>

      {/* 📄 Botón generar acta */}
      <button
        onClick={generarActaWord}
        disabled={!seleccionado}
        style={{
          padding: "10px 20px",
          backgroundColor: seleccionado ? "#28a745" : "#ccc",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: seleccionado ? "pointer" : "not-allowed",
          marginTop: "1rem",
        }}
      >
        Generar Acta
      </button>
    </div>
  );
};

export default ActasGrados;
