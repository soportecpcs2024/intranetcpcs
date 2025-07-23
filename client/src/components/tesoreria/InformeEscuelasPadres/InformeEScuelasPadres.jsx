import React from "react";
import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  TextRun,
} from "docx";

const GenerarWord = ({ data, mesSeleccionado }) => {
  const codigosPermitidos = ["1300", "1400", "1600", "1700"];

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
    const agrupado = [];

    data.forEach((factura) => {
      const fechaCompra = new Date(factura.asistencias.fechaCompra);
      const mesFactura = fechaCompra.getMonth();
      const mesSeleccionadoIndex = parseInt(mesSeleccionado) - 1;

      if (mesFactura !== mesSeleccionadoIndex) return;

      factura.clases
        .filter((clase) =>
          codigosPermitidos.includes(clase.cod?.toString())
        )
        .forEach((clase) => {
          agrupado.push({
            ...clase,
            nombreEstudiante: factura.estudianteId?.primer_nombre
              ? `${factura.estudianteId.primer_nombre} ${factura.estudianteId.segundo_nombre || ""} ${factura.estudianteId.primer_apellido || ""} ${factura.estudianteId.segundo_apellido || ""}`
              : "",
            grupo: factura.estudianteId?.grupo || "",
            grado: factura.estudianteId?.grado || "",
            fechaCompra,
          });
        });
    });

    if (agrupado.length === 0) {
      alert("No hay datos para el mes seleccionado.");
      return;
    }

    const codigosUnicos = [
      ...new Set(agrupado.map((clase) => clase.cod?.toString())),
    ];

    const content = [];

    codigosUnicos.forEach((cod) => {
      const clasesDelCodigo = agrupado.filter(
        (clase) => clase.cod?.toString() === cod
      );

      content.push(
        new Paragraph({
          text: getNombreCodigo(cod),
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 400 },
        })
      );

      clasesDelCodigo.forEach((clase, index) => {
        const linea = `${index + 1}. ${clase.nombreEstudiante} - Grupo: ${
          clase.grupo
        } - Grado: ${clase.grado}`;
        content.push(
          new Paragraph({
            children: [
              new TextRun({
                text: linea,
                font: "Arial",
                size: 24,
              }),
            ],
          })
        );
      });

      content.push(new Paragraph({ text: "" }));
    });

    const doc = new Document({
      sections: [
        {
          children: content,
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `informe_mensual_${mesSeleccionado}.docx`);
    });
  };

  return (
    <div>
      <button
        onClick={generarInformeWord}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Generar Word
      </button>
    </div>
  );
};

export default GenerarWord;
