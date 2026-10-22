import { useContext, useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { TareasContext } from "../../../contexts/TareaContext";
import "./mantenimientos.css";

const ITEMS_PER_PAGE = 20;

const SeguimientoMantenimiento = () => {
  const {
    mantenimientos,
    actualizarMantenimiento,
    obtenerMantenimientos,
  } = useContext(TareasContext);

  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroMes, setFiltroMes] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [generandoExcel, setGenerandoExcel] = useState(false);

  useEffect(() => {
    obtenerMantenimientos();
  }, []);

  // ==============================
  // FILTRAR MANTENIMIENTOS
  // ==============================

  const filtrarMantenimientos = () => {
    return mantenimientos.filter((m) => {
      const cumpleTipo = filtroTipo
        ? m.tipoMantenimiento === filtroTipo
        : true;

      const cumpleEstado = filtroEstado
        ? m.estado === filtroEstado
        : true;

      const cumpleMes = filtroMes
        ? new Date(m.fechaProgramada).getMonth() + 1 ===
          parseInt(filtroMes)
        : true;

      return cumpleTipo && cumpleEstado && cumpleMes;
    });
  };

  const filtrados = filtrarMantenimientos();

  // ==============================
  // PAGINACIÓN
  // ==============================

  const pageCount = Math.ceil(filtrados.length / ITEMS_PER_PAGE);
  const offset = currentPage * ITEMS_PER_PAGE;
  const currentItems = filtrados.slice(
    offset,
    offset + ITEMS_PER_PAGE
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // ==============================
  // RESUMEN GENERAL
  // ==============================

  const resumen = {
    total: mantenimientos.length,

    porTipo: {
      Preventivo: mantenimientos.filter(
        (m) => m.tipoMantenimiento === "Preventivo"
      ).length,

      Correctivo: mantenimientos.filter(
        (m) => m.tipoMantenimiento === "Correctivo"
      ).length,
    },

    porEstado: {
      Pendiente: mantenimientos.filter(
        (m) => m.estado === "Pendiente"
      ).length,

      Terminado: mantenimientos.filter(
        (m) => m.estado === "Terminado"
      ).length,
    },
  };

  // ==============================
  // MARCAR COMO TERMINADO
  // ==============================

  const marcarComoTerminado = async (id) => {
    try {
      await actualizarMantenimiento(id, {
        estado: "Terminado",
      });

      await obtenerMantenimientos();
    } catch (error) {
      console.error(
        "Error al marcar como terminado:",
        error
      );
    }
  };

  // ==============================
  // FUNCIÓN PARA FORMATEAR FECHAS
  // ==============================

  const formatearFecha = (fecha) => {
    if (!fecha) return "";

    const date = new Date(fecha);

    if (Number.isNaN(date.getTime())) return "";

    return date;
  };

  // ==============================
  // GENERAR EXCEL
  // ==============================

  const generarInformeExcel = async () => {
    try {
      setGenerandoExcel(true);

      // Se exportan los registros actualmente filtrados.
      const datosInforme = filtrados;

      if (datosInforme.length === 0) {
        alert(
          "No existen mantenimientos para los filtros seleccionados."
        );
        return;
      }

      const workbook = new ExcelJS.Workbook();

      workbook.creator =
        "Colegio Panamericano Colombo Sueco";

      workbook.lastModifiedBy =
        "Sistema de Mantenimientos";

      workbook.created = new Date();

      workbook.modified = new Date();

      workbook.company =
        "Colegio Panamericano Colombo Sueco";

      // ===================================================
      // HOJA 1 - RESUMEN
      // ===================================================

      const hojaResumen = workbook.addWorksheet(
        "Resumen",
        {
          views: [
            {
              showGridLines: false,
            },
          ],
          pageSetup: {
            orientation: "portrait",
            paperSize: 9,
            fitToPage: true,
            fitToWidth: 1,
            fitToHeight: 0,
          },
        }
      );

      hojaResumen.columns = [
        { key: "A", width: 5 },
        { key: "B", width: 35 },
        { key: "C", width: 22 },
        { key: "D", width: 22 },
        { key: "E", width: 22 },
        { key: "F", width: 22 },
      ];

      // Título principal
      hojaResumen.mergeCells("B2:F3");

      const titulo = hojaResumen.getCell("B2");

      titulo.value =
        "INFORME DE SEGUIMIENTO DE MANTENIMIENTOS";

      titulo.font = {
        name: "Calibri",
        size: 18,
        bold: true,
        color: {
          argb: "FFFFFFFF",
        },
      };

      titulo.alignment = {
        vertical: "middle",
        horizontal: "center",
      };

      titulo.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "FF1F4E78",
        },
      };

      // Colegio
      hojaResumen.mergeCells("B4:F4");

      const colegio = hojaResumen.getCell("B4");

      colegio.value =
        "Colegio Panamericano Colombo Sueco";

      colegio.font = {
        bold: true,
        size: 13,
        color: {
          argb: "FF1F4E78",
        },
      };

      colegio.alignment = {
        horizontal: "center",
      };

      // Fecha de generación
      hojaResumen.mergeCells("B6:C6");

      hojaResumen.getCell("B6").value =
        "Fecha de generación:";

      hojaResumen.getCell("B6").font = {
        bold: true,
      };

      hojaResumen.mergeCells("D6:F6");

      hojaResumen.getCell("D6").value = new Date();

      hojaResumen.getCell("D6").numFmt =
        'dd "de" mmmm "de" yyyy';

      // ==============================
      // FILTROS APLICADOS
      // ==============================

      hojaResumen.mergeCells("B8:F8");

      const tituloFiltros =
        hojaResumen.getCell("B8");

      tituloFiltros.value =
        "FILTROS APLICADOS";

      tituloFiltros.font = {
        bold: true,
        color: {
          argb: "FFFFFFFF",
        },
      };

      tituloFiltros.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "FF4472C4",
        },
      };

      tituloFiltros.alignment = {
        horizontal: "center",
      };

      hojaResumen.getCell("B9").value =
        "Tipo de mantenimiento";

      hojaResumen.getCell("C9").value =
        filtroTipo || "Todos";

      hojaResumen.getCell("B10").value =
        "Estado";

      hojaResumen.getCell("C10").value =
        filtroEstado || "Todos";

      hojaResumen.getCell("B11").value =
        "Mes";

      hojaResumen.getCell("C11").value =
        filtroMes
          ? new Date(
              2026,
              parseInt(filtroMes) - 1
            ).toLocaleString("es-CO", {
              month: "long",
            })
          : "Todos";

      ["B9", "B10", "B11"].forEach((celda) => {
        hojaResumen.getCell(celda).font = {
          bold: true,
        };

        hojaResumen.getCell(celda).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {
            argb: "FFD9EAF7",
          },
        };
      });

      // ==============================
      // INDICADORES
      // ==============================

      const total = datosInforme.length;

      const preventivos = datosInforme.filter(
        (m) =>
          m.tipoMantenimiento === "Preventivo"
      ).length;

      const correctivos = datosInforme.filter(
        (m) =>
          m.tipoMantenimiento === "Correctivo"
      ).length;

      const terminados = datosInforme.filter(
        (m) => m.estado === "Terminado"
      ).length;

      const pendientes = datosInforme.filter(
        (m) => m.estado === "Pendiente"
      ).length;

      const internos = datosInforme.filter(
        (m) => m.servicio === "Interno"
      ).length;

      const externos = datosInforme.filter(
        (m) => m.servicio === "Externo"
      ).length;

      const eficientes = datosInforme.filter(
        (m) => m.cumplimiento === "Eficiente"
      ).length;

      const tardios = datosInforme.filter(
        (m) => m.cumplimiento === "Tardío"
      ).length;

      const porcentajeCumplimiento =
        total > 0
          ? terminados / total
          : 0;

      hojaResumen.mergeCells("B13:F13");

      const tituloIndicadores =
        hojaResumen.getCell("B13");

      tituloIndicadores.value =
        "INDICADORES DE MANTENIMIENTO";

      tituloIndicadores.font = {
        bold: true,
        color: {
          argb: "FFFFFFFF",
        },
      };

      tituloIndicadores.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "FF1F4E78",
        },
      };

      tituloIndicadores.alignment = {
        horizontal: "center",
      };

      const indicadores = [
        ["Total de mantenimientos", total],
        ["Mantenimientos terminados", terminados],
        ["Mantenimientos pendientes", pendientes],
        ["Preventivos", preventivos],
        ["Correctivos", correctivos],
        ["Servicios internos", internos],
        ["Servicios externos", externos],
        ["Cumplimiento eficiente", eficientes],
        ["Cumplimiento tardío", tardios],
      ];

      let fila = 15;

      indicadores.forEach(
        ([nombre, valor], index) => {
          hojaResumen.getCell(
            `B${fila}`
          ).value = nombre;

          hojaResumen.getCell(
            `C${fila}`
          ).value = valor;

          hojaResumen.getCell(
            `B${fila}`
          ).font = {
            bold: true,
          };

          if (index % 2 === 0) {
            hojaResumen.getCell(
              `B${fila}`
            ).fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: {
                argb: "FFF2F2F2",
              },
            };

            hojaResumen.getCell(
              `C${fila}`
            ).fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: {
                argb: "FFF2F2F2",
              },
            };
          }

          fila++;
        }
      );

      // ==============================
      // PORCENTAJE CUMPLIMIENTO
      // ==============================

      fila += 1;

      hojaResumen.getCell(
        `B${fila}`
      ).value =
        "Porcentaje de ejecución";

      hojaResumen.getCell(
        `B${fila}`
      ).font = {
        bold: true,
        size: 12,
      };

      hojaResumen.getCell(
        `C${fila}`
      ).value = porcentajeCumplimiento;

      hojaResumen.getCell(
        `C${fila}`
      ).numFmt = "0.00%";

      hojaResumen.getCell(
        `C${fila}`
      ).font = {
        bold: true,
        size: 14,
        color: {
          argb:
            porcentajeCumplimiento >= 0.9
              ? "FF008000"
              : porcentajeCumplimiento >= 0.7
              ? "FFFF8C00"
              : "FFC00000",
        },
      };

      // ===================================================
      // HOJA 2 - DETALLE
      // ===================================================

      const hojaDetalle =
        workbook.addWorksheet(
          "Detalle Mantenimientos",
          {
            views: [
              {
                state: "frozen",
                ySplit: 5,
                showGridLines: false,
              },
            ],
            pageSetup: {
              orientation: "landscape",
              paperSize: 9,
              fitToPage: true,
              fitToWidth: 1,
              fitToHeight: 0,
            },
          }
        );

      // Título
      hojaDetalle.mergeCells("A1:L2");

      const tituloDetalle =
        hojaDetalle.getCell("A1");

      tituloDetalle.value =
        "COLEGIO PANAMERICANO COLOMBO SUECO";

      tituloDetalle.font = {
        size: 18,
        bold: true,
        color: {
          argb: "FFFFFFFF",
        },
      };

      tituloDetalle.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "FF1F4E78",
        },
      };

      tituloDetalle.alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      hojaDetalle.mergeCells("A3:L3");

      const subtitulo =
        hojaDetalle.getCell("A3");

      subtitulo.value =
        "Informe detallado de mantenimiento";

      subtitulo.font = {
        size: 13,
        bold: true,
        color: {
          argb: "FF1F4E78",
        },
      };

      subtitulo.alignment = {
        horizontal: "center",
      };

      // Encabezados
      const encabezados = [
        "N°",
        "Título",
        "Descripción",
        "Responsable",
        "Área",
        "Tipo",
        "Servicio",
        "Estado",
        "Fecha programada",
        "Fecha realización",
        "Cumplimiento",
        "Observaciones",
      ];

      const filaEncabezados =
        hojaDetalle.getRow(5);

      encabezados.forEach(
        (encabezado, index) => {
          const celda =
            filaEncabezados.getCell(index + 1);

          celda.value = encabezado;

          celda.font = {
            bold: true,
            color: {
              argb: "FFFFFFFF",
            },
          };

          celda.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {
              argb: "FF4472C4",
            },
          };

          celda.alignment = {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
          };

          celda.border = {
            top: {
              style: "thin",
              color: {
                argb: "FFFFFFFF",
              },
            },
            left: {
              style: "thin",
              color: {
                argb: "FFFFFFFF",
              },
            },
            bottom: {
              style: "thin",
              color: {
                argb: "FFFFFFFF",
              },
            },
            right: {
              style: "thin",
              color: {
                argb: "FFFFFFFF",
              },
            },
          };
        }
      );

      // Tamaño columnas
      hojaDetalle.columns = [
        { width: 7 },
        { width: 32 },
        { width: 50 },
        { width: 25 },
        { width: 22 },
        { width: 18 },
        { width: 16 },
        { width: 16 },
        { width: 20 },
        { width: 20 },
        { width: 18 },
        { width: 40 },
      ];

      // ==============================
      // REGISTROS
      // ==============================

      datosInforme.forEach(
        (mantenimiento, index) => {
          const row =
            hojaDetalle.addRow([
              index + 1,
              mantenimiento.titulo || "",
              mantenimiento.descripcion || "",
              mantenimiento.responsable || "",
              mantenimiento.area || "",
              mantenimiento.tipoMantenimiento ||
                "",
              mantenimiento.servicio || "",
              mantenimiento.estado || "",
              formatearFecha(
                mantenimiento.fechaProgramada
              ),
              formatearFecha(
                mantenimiento.fechaRealizacion
              ),
              mantenimiento.cumplimiento || "",
              mantenimiento.observaciones || "",
            ]);

          row.height = 35;

          row.eachCell((cell) => {
            cell.alignment = {
              vertical: "middle",
              wrapText: true,
            };

            cell.border = {
              top: {
                style: "thin",
                color: {
                  argb: "FFD9D9D9",
                },
              },
              left: {
                style: "thin",
                color: {
                  argb: "FFD9D9D9",
                },
              },
              bottom: {
                style: "thin",
                color: {
                  argb: "FFD9D9D9",
                },
              },
              right: {
                style: "thin",
                color: {
                  argb: "FFD9D9D9",
                },
              },
            };
          });

          // Zebra
          if (index % 2 === 1) {
            row.eachCell((cell) => {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: {
                  argb: "FFF8FAFC",
                },
              };
            });
          }

          // Fechas
          row.getCell(9).numFmt =
            "dd/mm/yyyy";

          row.getCell(10).numFmt =
            "dd/mm/yyyy";

          // Estado
          const celdaEstado =
            row.getCell(8);

          celdaEstado.font = {
            bold: true,
            color: {
              argb:
                mantenimiento.estado ===
                "Terminado"
                  ? "FF008000"
                  : "FFC00000",
            },
          };

          celdaEstado.alignment = {
            horizontal: "center",
            vertical: "middle",
          };

          // Cumplimiento
          const celdaCumplimiento =
            row.getCell(11);

          celdaCumplimiento.font = {
            bold: true,
            color: {
              argb:
                mantenimiento.cumplimiento ===
                "Eficiente"
                  ? "FF008000"
                  : mantenimiento.cumplimiento ===
                    "Tardío"
                  ? "FFFF8C00"
                  : "FF404040",
            },
          };

          celdaCumplimiento.alignment = {
            horizontal: "center",
            vertical: "middle",
          };
        }
      );

      // Autofiltro
      hojaDetalle.autoFilter = {
        from: {
          row: 5,
          column: 1,
        },
        to: {
          row: 5,
          column: 12,
        },
      };

      // ==============================
      // PIE DEL INFORME
      // ==============================

      const ultimaFila =
        hojaDetalle.rowCount + 2;

      hojaDetalle.mergeCells(
        `A${ultimaFila}:L${ultimaFila}`
      );

      const pie =
        hojaDetalle.getCell(
          `A${ultimaFila}`
        );

      pie.value = `Informe generado automáticamente el ${new Date().toLocaleDateString(
        "es-CO"
      )}. Total de registros: ${datosInforme.length}.`;

      pie.font = {
        italic: true,
        color: {
          argb: "FF666666",
        },
      };

      pie.alignment = {
        horizontal: "center",
      };

      // Configuración impresión
      hojaDetalle.headerFooter.oddFooter =
        "&LColegio Panamericano Colombo Sueco&CInforme de Mantenimiento&R Página &P de &N";

      // ==============================
      // GENERAR ARCHIVO
      // ==============================

      const buffer =
        await workbook.xlsx.writeBuffer();

      const fechaArchivo = new Date()
        .toISOString()
        .slice(0, 10);

      saveAs(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        `Informe_Mantenimientos_${fechaArchivo}.xlsx`
      );
    } catch (error) {
      console.error(
        "Error generando informe Excel:",
        error
      );

      alert(
        "Ocurrió un error generando el informe."
      );
    } finally {
      setGenerandoExcel(false);
    }
  };

  return (
    <div className="seguimiento-container">
      <div className="titulo-seguimiento">
        <div>
          <h2>
            Seguimiento de Mantenimientos
          </h2>
        </div>

        <button
          className="btn-excel"
          onClick={generarInformeExcel}
          disabled={generandoExcel}
        >
          {generandoExcel
            ? "Generando..."
            : "📊 Generar informe Excel"}
        </button>
      </div>

      {/* FILTROS */}

      <div className="filtros">
        <select
          onChange={(e) => {
            setFiltroTipo(e.target.value);
            setCurrentPage(0);
          }}
          value={filtroTipo}
        >
          <option value="">
            Tipo de mantenimiento
          </option>

          <option value="Preventivo">
            Preventivo
          </option>

          <option value="Correctivo">
            Correctivo
          </option>
        </select>

        <select
          onChange={(e) => {
            setFiltroEstado(e.target.value);
            setCurrentPage(0);
          }}
          value={filtroEstado}
        >
          <option value="">
            Estado
          </option>

          <option value="Pendiente">
            Pendiente
          </option>

          <option value="Terminado">
            Terminado
          </option>
        </select>

        <select
          onChange={(e) => {
            setFiltroMes(e.target.value);
            setCurrentPage(0);
          }}
          value={filtroMes}
        >
          <option value="">
            Mes
          </option>

          {[...Array(12)].map((_, i) => (
            <option
              key={i}
              value={i + 1}
            >
              {new Date(
                0,
                i
              ).toLocaleString(
                "es-ES",
                {
                  month: "long",
                }
              )}
            </option>
          ))}
        </select>
      </div>

      {/* RESUMEN */}

      <div className="resumen">
        <p>
          Total: {resumen.total}
        </p>

        <p>
          Preventivos:{" "}
          {resumen.porTipo.Preventivo}
        </p>

        <p>
          Correctivos:{" "}
          {resumen.porTipo.Correctivo}
        </p>

        <p>
          Pendientes:{" "}
          {resumen.porEstado.Pendiente}
        </p>

        <p>
          Terminados:{" "}
          {resumen.porEstado.Terminado}
        </p>
      </div>

      {/* TABLA */}

      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Responsable</th>
            <th>Área</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>
              Programado terminar
            </th>
            <th>Acción</th>
          </tr>
        </thead>

        <tbody>
          {currentItems.map((m) => (
            <tr key={m._id}>
              <td>{m.titulo}</td>

              <td>{m.descripcion}</td>

              <td>{m.responsable}</td>

              <td>{m.area}</td>

              <td>
                {m.tipoMantenimiento}
              </td>

              <td
                className={
                  m.estado === "Terminado"
                    ? "estado terminado"
                    : "estado pendiente"
                }
              >
                {m.estado}
              </td>

              <td>
                {new Date(
                  m.fechaProgramada
                ).toLocaleDateString(
                  "es-CO",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </td>

              <td>
                {m.estado ===
                "Pendiente" ? (
                  <button
                    className="btn-fin"
                    onClick={() =>
                      marcarComoTerminado(
                        m._id
                      )
                    }
                  >
                    Terminar
                  </button>
                ) : (
                  <span className="terminado">
                    ✓
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINACIÓN */}

      {pageCount > 1 && (
        <ReactPaginate
          previousLabel={
            "← Anterior"
          }
          nextLabel={
            "Siguiente →"
          }
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={1}
          pageRangeDisplayed={2}
          onPageChange={
            handlePageClick
          }
          forcePage={
            currentPage
          }
          containerClassName={
            "paginacion"
          }
          activeClassName={
            "paginacion-activa"
          }
          previousClassName={
            "paginacion-prev"
          }
          nextClassName={
            "paginacion-next"
          }
        />
      )}
    </div>
  );
};

export default SeguimientoMantenimiento;