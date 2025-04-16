import React, { useState, useEffect } from "react";
import { useRecaudo } from "../../../../../contexts/RecaudoContext";
import { MdNoFood } from "react-icons/md";
import BuscadorEstudiante from "../buscador/BuscadorEstudiante";

import "./Almuerzos.css";
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
import { saveAs } from "file-saver";
import { ImageRun } from "docx";
import ListaAlmuerzosVendidos from "./ListaAlmuerzosVendidos";
import EstadisticasAlmuerzo from "./EstadisticasAlmuerzo";

const Almuerzos = () => {
  const {
    almuerzo,
     
    fetchAlmuerzos,
    almuerzoFactura,
    crearAlmuerzoFactura,
    fetchEstudianteById,
    fetchAlmuerzoFactura,
  } = useRecaudo();

  const [seleccionados, setSeleccionados] = useState({});
  const [estudiante, setEstudiante] = useState(null);
  const [limpiarCampos, setLimpiarCampos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tipoPago, setTipoPago] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [ultimaFactura, setUltimaFactura] = useState(null);
  const [facturaAceptada, setFacturaAceptada] = useState(false);

  // Cargar almuerzos y facturas si no están en el contexto
  useEffect(() => {
    if (almuerzo.length === 0) {
      fetchAlmuerzos();
    }
    fetchAlmuerzoFactura();
  }, [almuerzo, fetchAlmuerzos, fetchAlmuerzoFactura]);

  // Obtener la última factura
  const obtenerUltimaFactura = async () => {
    await fetchAlmuerzoFactura(); // Espera que se actualicen los datos

    if (!almuerzoFactura || almuerzoFactura.length === 0) {
      alert("No hay una factura reciente para descargar.");
      return;
    }

    const ultima = almuerzoFactura[almuerzoFactura.length - 1]; // Obtiene el último registro
    setUltimaFactura(ultima); // Actualiza el estado

    // Llamamos a la función para generar el archivo Word
    generarWordFactura(ultima);
  };

  const generarWordFactura = (factura) => {
    setFacturaAceptada(false); // Permite mostrar el botón después de aceptar
    const doc = new Document({
      sections: [
        {
          properties: {},
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
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "BAZAR 2025",
                  bold: true,
                  size: 20,
                  font: "Arial",
                }),
              ],
              spacing: { after: 100 },
            }),

            new Paragraph({
              spacing: { before: 100 },
              children: [
                new TextRun({
                  text: "Número de Factura: ",
                  bold: true, // Solo este texto estará en negrita
                  size: 20,
                }),
                new TextRun({
                  text: `${factura.numero_factura}`,
                  size: 18,
                  font: "Arial",
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Fecha de compra: ",
                  bold: true, // Solo este texto estará en negrita
                  size: 20,
                }),
                new TextRun({
                  text: new Date().toLocaleDateString("es-ES"),
                  size: 18,
                  font: "Arial",
                }),
              ],
            }),

            new Paragraph({
              spacing: { before: 200, after: 100 },
              children: [
                new TextRun({
                  text: "Nombre del estudiante: ",
                  bold: true, // Solo este texto estará en negrita
                  size: 20,
                }),
                new TextRun({
                  text: `${factura.estudianteId.nombre}`,
                  size: 20,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Tipo de Pago: ",
                  bold: true, // Solo este texto estará en negrita
                  size: 20,
                }),
                new TextRun({
                  text: `${factura.tipoPago}`,
                  size: 20,
                }),
              ],
            }),

            new Paragraph({
              text: `__________________________________`,
              spacing: { before: 50, after: 50 },
              verticalAlign: VerticalAlign.CENTER,
            }),

            new Paragraph({
              spacing: { after: 100 },
              children: [
                new TextRun({
                  text: "ALMUERZOS COMPRADOS: ",
                  bold: true,
                  size: 25,
                }),
              ],
            }),
            ...factura.almuerzos.map(
              (item) =>
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${item.almuerzoId.nombre} (x${item.cantidad}) - $${item.almuerzoId.costo}`,
                      size: 20,
                    }),
                  ],
                })
            ),
            new Paragraph({
              text: `__________________________________`,
              spacing: { after: 50 },
              verticalAlign: VerticalAlign.CENTER,
            }),

            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  text: "Registrado por: ",

                  size: 20,
                }),
                new TextRun({
                  text: `LINA MARIA HOYOS RESTREPO`,
                  size: 20,
                  bold: true,
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
                    minimumFractionDigits: 0,
                  }).format(factura?.total || 0)}`,
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

    // Generar el archivo Word
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `Factura_${factura.estudianteId.nombre}.docx`);
    });
  };
  // Monitorea cambios en almuerzoFactura para actualizar ultimaFactura
  useEffect(() => {
    if (almuerzoFactura.length > 0) {
      setUltimaFactura(almuerzoFactura[almuerzoFactura.length - 1]);
    }
  }, [almuerzoFactura]);

  // Manejar cambios en la cantidad de almuerzos seleccionados
  const handleCantidadChange = (id, cantidad) => {
    setSeleccionados((prev) => ({
      ...prev,
      [id]: cantidad,
    }));
  };

  // Manejar cambio de tipo de pago y mostrar el botón de Pre Factura
  const handleTipoPagoChange = (event) => {
    setTipoPago(event.target.value);
    setShowButton(true);
  };

  // Calcular el total a pagar
  const calcularTotal = () => {
    const total = Object.entries(seleccionados).reduce(
      (sum, [id, cantidad]) => {
        const almuerzoItem = almuerzo.find((item) => item._id === id);
        return sum + (almuerzoItem ? almuerzoItem.costo * cantidad : 0);
      },
      0
    );

    return total.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    });
  };

  // Guardar factura con validaciones
  const guardarFactura = async () => {
    if (!estudiante) {
      alert("Seleccione un estudiante antes de guardar la factura");
      return;
    }

    if (!tipoPago) {
      alert("Seleccione un tipo de pago antes de guardar la factura");
      return;
    }

    const factura = Object.entries(seleccionados)
      .filter(([_, cantidad]) => cantidad > 0)
      .map(([id, cantidad]) => ({
        almuerzoId: id,
        cantidad: cantidad,
      }));

    if (factura.length === 0) {
      alert("Seleccione al menos un almuerzo");
      console.log("Id factura actual:", factura._id);
      return;
    }

    try {
      await crearAlmuerzoFactura({
        estudianteId: estudiante._id,
        almuerzos: factura,
        tipoPago, // Se incluye el tipo de pago
      });

      alert("Factura guardada correctamente");
      setSeleccionados({});
      setEstudiante(null);
      setTipoPago("");
      setLimpiarCampos(true);
      setShowButton(false);
      fetchAlmuerzoFactura();
      setFacturaAceptada(true); // Permite mostrar el botón después de aceptar

      setTimeout(() => setLimpiarCampos(false), 100);
    } catch (error) {
      console.error(
        "Error al guardar la factura:",
        error?.response?.data || error
      );
      alert("Hubo un error al guardar la factura");
    }
  };


   
  return (
    <div className="almuerzos">
      <div className="container-almuerzo box1Almuerzos">
        <h2 className="title-almuerzo">RECAUDO ALMUERZOS BAZAR 2025 CPCS</h2>

        <div className="header-almuerzos">
          <div>
            {/* Buscador de Estudiantes */}
            <BuscadorEstudiante
              fetchEstudianteById={fetchEstudianteById}
              setEstudiante={setEstudiante}
              setLoading={setLoading}
              estudiante={estudiante}
              limpiarCampos={limpiarCampos}
            />
          </div>
          <div>
            {/* Botón para descargar la última factura */}
            {facturaAceptada && (
              <button
                className="header-descarga"
                onClick={obtenerUltimaFactura}
              >
                Descargar factura
              </button>
            )}
          </div>
        </div>

        {/* Lista de Almuerzos */}
        {/* Lista de Almuerzos */}
        <div className="lista-almuerzos">
          {almuerzo.length > 0 ? (
            almuerzo.map((item) => (
              <div key={item._id} className="almuerzo-item">
                <MdNoFood className="icono-almuerzo" />
                <span className="almuerzo-info">
                  {item.nombre} -{" "}
                  <strong>
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    }).format(item.costo)}
                  </strong>
                </span>
                <input
                  type="number"
                  min="0"
                  className="almuerzo-conteo"
                  value={seleccionados[item._id] || 0}
                  onChange={(e) =>
                    handleCantidadChange(
                      item._id,
                      parseInt(e.target.value, 10) || 0
                    )
                  }
                />
              </div>
            ))
          ) : (
            <p className="texto-vacio">No hay almuerzos disponibles</p>
          )}

          {/* Sección de Totales y Tipo de Pago */}
          <div className="almuerzo_btn">
            <div className="almuerzo-totales">
              <div>
                <h3>TOTAL</h3>
              </div>
              <div>
                <h2 className="almuerzo_btn-p">{calcularTotal()}</h2>
              </div>
            </div>

            {/* Selección de Tipo de Pago */}
            <div className="container-tipopago-flex">
              <div className="container-tipopago">
                <h4>Tipo de Pago:</h4>
                {["Efectivo", "Datáfono", "Nómina"].map((tipo) => (
                  <label key={tipo}>
                    <input
                      type="radio"
                      value={tipo}
                      checked={tipoPago === tipo}
                      onChange={handleTipoPagoChange}
                      className="tipopago_radio"
                    />{" "}
                    {tipo}
                  </label>
                ))}
              </div>
            </div>

            {/* Botón para Guardar Factura */}
            <button onClick={guardarFactura} className="boton-guardar">
              Registrar Factura
            </button>
          </div>
        </div>
      </div>

      <div className="box1Almuerzos">
        <EstadisticasAlmuerzo/>
        <ListaAlmuerzosVendidos/>    
        </div>
    </div>
  );
};

export default Almuerzos;
