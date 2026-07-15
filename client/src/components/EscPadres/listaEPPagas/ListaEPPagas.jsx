import { useEffect, useState } from "react";
import { useRecaudo } from "../../../contexts/RecaudoContext";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./ListaEPPagas.css";

const ITEMS_PER_PAGE = 10;

const CODIGOS_PERMITIDOS = [1300, 1400, 1600, 1700, 2400];

const ListaEPPagas = () => {
  const { facturas, fetchFacturas } = useRecaudo();

  const [datosCompletos, setDatosCompletos] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [conteoClases, setConteoClases] = useState({});

  const [mesSeleccionado, setMesSeleccionado] = useState("");

  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const getNombreEscuela = (cod) => {
    switch (Number(cod)) {
      case 1300:
        return "Ciberfamilias";

      case 1400:
        return "El arte de ser Padres";

      case 1600:
        return "Guiando a sus adolescentes";

      case 1700:
        return "Mayordomía financiera";

      case 2400:
        return "Hablando de sexualidad en casa";

      default:
        return "Escuela desconocida";
    }
  };

  const formatFechaColombia = (fechaStr) => {
    if (!fechaStr) return "N/A";

    const fecha = new Date(fechaStr);

    if (Number.isNaN(fecha.getTime())) {
      return "N/A";
    }

    return fecha.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "America/Bogota",
    });
  };

  // Cargar las facturas al abrir el componente
  useEffect(() => {
    fetchFacturas?.();
  }, [fetchFacturas]);

  // Convertir las facturas en registros para la tabla
  useEffect(() => {
    const resultado = [];

    (facturas || []).forEach((factura) => {
      (factura.clases || []).forEach((clase) => {
        const codigo = Number(clase.cod);

        if (!CODIGOS_PERMITIDOS.includes(codigo)) {
          return;
        }

        resultado.push({
          idFactura: factura._id,
          numeroFactura: factura.numero_factura || "N/A",

          nombreEstudiante:
            factura.estudianteId?.nombre || "N/A",

          documento:
            factura.estudianteId?.documentoIdentidad || "N/A",

          grado:
            factura.estudianteId?.grado || "N/A",

          nombreClase:
            clase.nombreClase || "N/A",

          cod: codigo,
          dia: clase.dia || "N/A",
          hora: clase.hora || "N/A",
          total: factura.total || 0,
          tipoPago: factura.tipoPago || "N/A",
          mesAplicado: factura.mes_aplicado || "N/A",

          // Fecha original para filtrar y ordenar
          fechaCompraOriginal: factura.fechaCompra,

          // Fecha formateada para mostrar
          fechaCompra: formatFechaColombia(
            factura.fechaCompra
          ),
        });
      });
    });

    resultado.sort((a, b) => {
      const diferenciaEscuela = getNombreEscuela(
        a.cod
      ).localeCompare(getNombreEscuela(b.cod));

      if (diferenciaEscuela !== 0) {
        return diferenciaEscuela;
      }

      return (
        new Date(b.fechaCompraOriginal).getTime() -
        new Date(a.fechaCompraOriginal).getTime()
      );
    });

    setDatosCompletos(resultado);
  }, [facturas]);

  // Filtrar por mes y recalcular los conteos
  useEffect(() => {
    let resultadoFiltrado = [...datosCompletos];

    if (mesSeleccionado !== "") {
      resultadoFiltrado = datosCompletos.filter((item) => {
        if (!item.fechaCompraOriginal) {
          return false;
        }

        const fechaCompra = new Date(
          item.fechaCompraOriginal
        );

        if (Number.isNaN(fechaCompra.getTime())) {
          return false;
        }

        const mesCompra = Number(
          fechaCompra.toLocaleString("en-US", {
            month: "numeric",
            timeZone: "America/Bogota",
          })
        );

        return mesCompra === Number(mesSeleccionado);
      });
    }

    const nuevoConteo = {
      1300: 0,
      1400: 0,
      1600: 0,
      1700: 0,
      2400: 0,
    };

    resultadoFiltrado.forEach((item) => {
      nuevoConteo[item.cod] =
        (nuevoConteo[item.cod] || 0) + 1;
    });

    setFilteredData(resultadoFiltrado);
    setConteoClases(nuevoConteo);

    // Volver a la primera página cuando cambia el filtro
    setCurrentPage(0);
  }, [mesSeleccionado, datosCompletos]);

  // Paginación
  useEffect(() => {
    const inicio = currentPage * ITEMS_PER_PAGE;
    const final = inicio + ITEMS_PER_PAGE;

    setCurrentItems(
      filteredData.slice(inicio, final)
    );

    setPageCount(
      Math.ceil(filteredData.length / ITEMS_PER_PAGE)
    );
  }, [currentPage, filteredData]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const exportToExcel = () => {
    if (filteredData.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    const datosExcel = filteredData.map((item) => ({
      Factura: item.numeroFactura,
      Escuela: getNombreEscuela(item.cod),
      "Nombre estudiante": item.nombreEstudiante,
      Documento: item.documento,
      Grado: item.grado,
      "Fecha de compra": item.fechaCompra,
      "Tipo de pago": item.tipoPago,
      Total: item.total,
    }));

    const worksheet =
      XLSX.utils.json_to_sheet(datosExcel);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Facturas"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const archivo = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const nombreMes =
      mesSeleccionado === ""
        ? "todos-los-meses"
        : obtenerNombreMes(mesSeleccionado);

    saveAs(
      archivo,
      `familias-escuelas-pagas-${nombreMes}-${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`
    );
  };

  const obtenerNombreMes = (numeroMes) => {
    const meses = [
      "",
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

    return meses[Number(numeroMes)] || "mes";
  };

  return (
    <div className="container_lista_ep">
      <h3>Familias con Escuelas Pagas</h3>

      <div className="filtro-mes">
        <label htmlFor="mesCompra">
          Filtrar por mes de compra:
        </label>

        <select
          id="mesCompra"
          value={mesSeleccionado}
          onChange={(event) =>
            setMesSeleccionado(event.target.value)
          }
        >
          <option value="">Todos los meses</option>
          <option value="1">Enero</option>
          <option value="2">Febrero</option>
          <option value="3">Marzo</option>
          <option value="4">Abril</option>
          <option value="5">Mayo</option>
          <option value="6">Junio</option>
          <option value="7">Julio</option>
          <option value="8">Agosto</option>
          <option value="9">Septiembre</option>
          <option value="10">Octubre</option>
          <option value="11">Noviembre</option>
          <option value="12">Diciembre</option>
        </select>
      </div>

      <div className="conteo-clases">
        <p className="conteo-class">
          🧩 El arte de ser Padres:{" "}
          {conteoClases[1400] || 0}
        </p>

        <p className="conteo-class">
          💰 Mayordomía financiera:{" "}
          {conteoClases[1700] || 0}
        </p>

        <p className="conteo-class">
          👨‍👩‍👧 Hablando de sexualidad en casa:{" "}
          {conteoClases[2400] || 0}
        </p>

        <div className="total-familias">
          <span>Total familias activas:</span>

          <span className="total-conteo">
            {filteredData.length}
          </span>
        </div>

        <button
          type="button"
          onClick={exportToExcel}
          className="btn-descargar"
        >
          📥 Descargar Excel
        </button>
      </div>

      <table className="tabla-ep">
        <thead>
          <tr>
            <th>#</th>
            <th>Escuela</th>
            <th>Nombre estudiante</th>
            <th>Grado</th>
            <th>Fecha de compra</th>
          </tr>
        </thead>

        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((item, index) => (
              <tr
                key={`${item.idFactura}-${item.cod}-${index}`}
              >
                <td>
                  {currentPage * ITEMS_PER_PAGE +
                    index +
                    1}
                </td>

                <td>
                  {getNombreEscuela(item.cod)}
                </td>

                <td>{item.nombreEstudiante}</td>

                <td>{item.grado}</td>

                <td>{item.fechaCompra}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">
                No hay registros para el mes seleccionado.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {pageCount > 1 && (
        <ReactPaginate
          previousLabel="<<"
          nextLabel=">>"
          pageCount={pageCount}
          forcePage={currentPage}
          onPageChange={handlePageClick}
          containerClassName="pagination"
          activeClassName="active"
        />
      )}
    </div>
  );
};

export default ListaEPPagas;