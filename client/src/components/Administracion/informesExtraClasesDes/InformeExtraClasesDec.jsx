import { useState, useEffect } from "react";
import { useRecaudo } from "../../../contexts/RecaudoContext";

import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  TextRun,
  AlignmentType,
} from "docx";
import { saveAs } from "file-saver";
import KPIsExtraClases from "./KPIsExtraClases";
import ReporteAsistencias from "./ReporteAsistencia/ReporteAsistencias";

const InformeExtraClasesDec = () => {
  const [mesSeleccionado, setMesSeleccionado] = useState("");
  const { facturas } = useRecaudo();
  const [facturasFiltradas, setFacturasFiltradas] = useState([]);

  const grupo130 = [
    "PRE-JARDIN",
    "JARDIN",
    "TRANSICION A",
    "TRANSICION B",
    "TRANSICION C",
    "PRIMERO A",
    "PRIMERO B",
    "PRIMERO C",
    "SEGUNDO A",
    "SEGUNDO B",
    "SEGUNDO C",
    "TERCERO A",
    "TERCERO B",
    "TERCERO C",
    "CUARTO A",
    "CUARTO B",
    "CUARTO C",
    "QUINTO A",
    "QUINTO B",
    "QUINTO C",
  ];

  const grupo300 = [
    "SEXTO A",
    "SEXTO B",
    "SEXTO C",
    "SEPTIMO A",
    "SEPTIMO B",
    "SEPTIMO C",
    "OCTAVO A",
    "OCTAVO B",
    "OCTAVO C",
    "NOVENO A",
    "NOVENO B",
    "NOVENO C",
    "DECIMO A",
    "DECIMO B",
    "DECIMO C",
    "ONCE A",
    "ONCE B",
    "ONCE C",
  ];

  useEffect(() => {
    if (facturas.length > 0) {
      const codValidos = [
        "100",
        "200",
        "300",
        "400",
        "500",
        "600",
        "700",
        "800",
        "900",
        "1100",
        "2200",
        "2300",
      ];

      const nuevasFacturas = facturas
        .filter((factura) =>
          factura.clases?.some((clase) =>
            codValidos.includes(clase.cod?.toString())
          )
        )
        .map((factura) => ({
          ...factura,
          nombreEstudiante:
            factura.estudianteId?.nombre?.trim() || "Desconocido",
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
      case "100":
        return "Inglés";
      case "200":
        return "Iniciación Musical Preescolar";
      case "300":
        return "Piano jueves";
      case "400":
        return "Tecnica Vocal";
      case "500":
        return "Guitarra y Bajo";
      case "600":
        return "Bateria";
      case "700":
        return "Baloncesto";
      case "800":
        return "Voleibol";
      case "900":
        return "Microfútbol";
      case "1100":
        return "Exploración Motriz y Predeportiva Pre";
      case "2200":
        return "Piano lunes";
      case "2300":
        return "Iniciación al Arte";
      default:
        return `Código: ${cod}`;
    }
  };

  const obtenerHoraPorGrado = (grado, horaOriginal) => {
    const gradoNormalizado = grado?.trim().toUpperCase();

    const grupos130Hora = [
      "PRE-JARDIN",
  "JARDIN",
  "TRANSICION A",
  "TRANSICION B",
  "TRANSICION C",
  "PRIMERO A",
  "PRIMERO B",
  "PRIMERO C",
  "SEGUNDO A",
  "SEGUNDO B",
  "SEGUNDO C",
  "TERCERO A",
  "TERCERO B",
  "TERCERO C",
  "CUARTO A",
  "CUARTO B",
  "CUARTO C",
  "QUINTO A",
  "QUINTO B",
  "QUINTO C",
    ];

    const grupos300Hora = ["SEXTO A",
  "SEXTO B",
  "SEXTO C",
  "SEPTIMO A",
  "SEPTIMO B",
  "SEPTIMO C",
  "OCTAVO A",
  "OCTAVO B",
  "OCTAVO C",
  "NOVENO A",
  "NOVENO B",
  "NOVENO C",
  "DECIMO A",
  "DECIMO B",
  "DECIMO C",
  "ONCE A",
  "ONCE B",
  "ONCE C",];

    if (grupos130Hora.includes(gradoNormalizado)) {
      return "1:30 pm";
    }

    if (grupos300Hora.includes(gradoNormalizado)) {
      return "3:00 pm";
    }

    return horaOriginal || "N/A";
  };

  const obtenerResumenPorNivel = (items) => {
    const resumenPrimaria = {};
    const resumenBachillerato = {};

    items.forEach((item) => {
      const grado = item.grado?.trim().toUpperCase();

      if (grupo130.includes(grado)) {
        resumenPrimaria[grado] = (resumenPrimaria[grado] || 0) + 1;
      } else if (grupo300.includes(grado)) {
        resumenBachillerato[grado] = (resumenBachillerato[grado] || 0) + 1;
      }
    });

    return {
      resumenPrimaria,
      resumenBachillerato,
      totalPrimaria: Object.values(resumenPrimaria).reduce(
        (acc, val) => acc + val,
        0
      ),
      totalBachillerato: Object.values(resumenBachillerato).reduce(
        (acc, val) => acc + val,
        0
      ),
    };
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
        const cod = clase.cod;
        if (!agrupado[cod]) agrupado[cod] = [];

        agrupado[cod].push({
          estudiante: factura.estudianteId?.nombre || "N/A",
          nombreClase: clase.nombreClase || getNombreCodigo(clase.cod),
          grado: factura.estudianteId?.grado || "N/A",
          total: factura.total,
          tipoPago: factura.tipoPago,
          aplicado: factura.mes_aplicado,
          mes: mesFactura,
          dia: clase.dia,
          hora: obtenerHoraPorGrado(
            factura.estudianteId?.grado,
            clase.hora
          ),
        });
      });
    });

    if (Object.keys(agrupado).length === 0) {
      alert("No hay datos para el mes seleccionado.");
      return;
    }

    const content = [];

    content.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "COLEGIO PANAMERICANO COLOMBOSUECO",
            bold: true,
            size: 40,
          }),
        ],
        spacing: { after: 300 },
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "Informe general de venta Clases Extracurriculares",
            size: 30,
          }),
        ],
        spacing: { after: 200 },
      }),
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            text: `Mes: ${mesSeleccionado.toUpperCase()}`,
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

    let totalNominaGlobal = 0;
    let totalDatafonoGlobal = 0;
    let totalEfectivoGlobal = 0;
    let totalGlobal = 0;

    Object.entries(agrupado).forEach(([cod, items]) => {
      items.sort((a, b) =>
        a.tipoPago
          .trim()
          .toLowerCase()
          .localeCompare(b.tipoPago.trim().toLowerCase())
      );

      const {
        resumenPrimaria,
        resumenBachillerato,
        totalPrimaria,
        totalBachillerato,
      } = obtenerResumenPorNivel(items);

      const textoPrimaria = Object.entries(resumenPrimaria)
        .map(([grado, cantidad]) => `${grado}: ${cantidad}`)
        .join(" | ");

      const textoBachillerato = Object.entries(resumenBachillerato)
        .map(([grado, cantidad]) => `${grado}: ${cantidad}`)
        .join(" | ");

      content.push(
        new Paragraph({
          text: getNombreCodigo(cod),
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        })
      );

      content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Total registros: ",
              bold: true,
              size: 24,
            }),
            new TextRun({
              text: items.length.toString(),
            }),
          ],
          spacing: { before: 100, after: 120 },
        })
      );

      content.push(
       
        new Paragraph({
          children: [
            new TextRun({
              text: `PRIMARIA (${totalPrimaria}): `,
              bold: true,
            }),
            new TextRun({
              text: textoPrimaria || "Sin registros",
            }),
          ],
          spacing: { after: 80 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `BACHILLERATO (${totalBachillerato}): `,
              bold: true,
            }),
            new TextRun({
              text: textoBachillerato || "Sin registros",
            }),
          ],
          spacing: { after: 180 },
        })
      );

      const tablaDatos = new Table({
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              "Estudiante",
              "Clase",
              "Grado",
              "Día",
              "Hora",
              "Aplicado",
            ].map((text) =>
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text,
                        bold: true,
                      }),
                    ],
                  }),
                ],
                shading: { fill: "F4F2F2" },
              })
            ),
          }),
          ...items.map(
            (item) =>
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph(item.estudiante)],
                  }),
                  new TableCell({
                    children: [new Paragraph(item.nombreClase)],
                  }),
                  new TableCell({
                    children: [new Paragraph(item.grado)],
                  }),
                  new TableCell({
                    children: [new Paragraph(item.dia || "N/A")],
                  }),
                  new TableCell({
                    children: [new Paragraph(item.hora || "N/A")],
                  }),
                  new TableCell({
                    children: [new Paragraph(item.aplicado || "N/A")],
                  }),
                ],
              })
          ),
        ],
      });

      content.push(tablaDatos);

      let subtotalNomina = 0;
      let subtotalDatafono = 0;
      let subtotalEfectivo = 0;

      items.forEach((item) => {
        if (item.tipoPago === "Nómina") subtotalNomina += item.total;
        else if (item.tipoPago === "Datáfono") subtotalDatafono += item.total;
        else if (item.tipoPago === "Efectivo") subtotalEfectivo += item.total;
      });

      const totalGeneral = subtotalNomina + subtotalDatafono + subtotalEfectivo;

      totalNominaGlobal += subtotalNomina;
      totalDatafonoGlobal += subtotalDatafono;
      totalEfectivoGlobal += subtotalEfectivo;
      totalGlobal += totalGeneral;
    });

    content.push(
      new Paragraph({
        text: "",
        spacing: { before: 300, after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Resumen económico general",
            bold: true,
            size: 26,
          }),
        ],
        spacing: { after: 180 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Total Nómina: ", bold: true }),
          new TextRun({ text: `$ ${totalNominaGlobal.toLocaleString("es-CO")}` }),
        ],
        spacing: { after: 80 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Total Datáfono: ", bold: true }),
          new TextRun({
            text: `$ ${totalDatafonoGlobal.toLocaleString("es-CO")}`,
          }),
        ],
        spacing: { after: 80 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Total Efectivo: ", bold: true }),
          new TextRun({
            text: `$ ${totalEfectivoGlobal.toLocaleString("es-CO")}`,
          }),
        ],
        spacing: { after: 80 },
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Total General: ", bold: true }),
          new TextRun({ text: `$ ${totalGlobal.toLocaleString("es-CO")}` }),
        ],
        spacing: { after: 120 },
      })
    );

    const doc = new Document({
      sections: [{ children: content }],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `Informe_extra_clases_${mesSeleccionado}.docx`);
    });
  };

  return (
    <div className="layout-academico-container">
      <header className="header-extraclases">
        <div className="header-extraclases-informes">
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
              <button
                className="informe-item btn-excel"
                onClick={generarInformeWord}
              >
                Generar Informe
              </button>
            </li>
          </ul>
        </div>
        <div className="header-extraclases-informes"></div>
      </header>

      <KPIsExtraClases
        data={facturasFiltradas.filter((factura) => {
          const mesFactura = new Date(factura.fechaCompra).toLocaleString(
            "es-ES",
            { month: "long" }
          );
          return mesFactura.toLowerCase() === mesSeleccionado.toLowerCase();
        })}
      />

      <ReporteAsistencias
        data={facturasFiltradas.filter((factura) => {
          const mesFactura = new Date(factura.fechaCompra).toLocaleString(
            "es-ES",
            { month: "long" }
          );
          return mesFactura.toLowerCase() === mesSeleccionado.toLowerCase();
        })}
      />
    </div>
  );
};

export default InformeExtraClasesDec;