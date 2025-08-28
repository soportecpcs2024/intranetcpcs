import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { format } from "date-fns";
import { LlegadasTardeData } from "../../../../api/DataApi";
import FiltroLlegadasTarde from "../../../../components/FiltroLlegadasTarde";
import ReactPaginate from "react-paginate";
import "./LlegadasTarde.css";
import SpinnerComponent from "../../../../components/SpinnerComponent";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const ITEMS_PER_PAGE = 20;

const LlegadasTarde = () => {
  const [llegadasTarde, setLlegadasTarde] = useState([]);
  const [filteredLlegadasTarde, setFilteredLlegadasTarde] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const printRef = useRef();

  const fetchLlegadasTarde = useCallback(async () => {
    try {
      const data = await LlegadasTardeData();
      setLlegadasTarde(data);
      setFilteredLlegadasTarde(data);
    } catch (err) {
      setError(err.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLlegadasTarde();
  }, [fetchLlegadasTarde]);

  const filteredData = useMemo(() => {
    return selectedGroup === ""
      ? llegadasTarde
      : llegadasTarde.filter(
          (llegada) => llegada.grupo.trim() === selectedGroup.trim()
        );
  }, [selectedGroup, llegadasTarde]);

  useEffect(() => {
    const endOffset = (currentPage + 1) * ITEMS_PER_PAGE;
    setCurrentItems(
      filteredData.slice(currentPage * ITEMS_PER_PAGE, endOffset)
    );
    setPageCount(Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  }, [currentPage, filteredData]);

  const formatDate = (date) => {
    const formattedDate = format(new Date(date), "dd/MM/yyyy");
    const [day, month, year] = formattedDate.split("/");
    return { day, month, year };
  };

  // === Descargar Excel con estilos ===
  const handleDownloadExcel = async () => {
    if (!filteredData || filteredData.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    // Preparar datos
    const datosExport = filteredData.map((llegada) => ({
      Estudiante: [
        llegada.primer_apellido,
        llegada.segundo_apellido,
        llegada.primer_nombre,
      ]
        .filter(Boolean)
        .join(" "),
      Identificación: llegada.num_identificacion,
      Fechas: llegada.fechas
        .map((date) => format(new Date(date), "dd/MM/yyyy"))
        .join(", "),
      Cantidad: llegada.fechas.length,
    }));

    // Crear workbook y hoja
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("LlegadasTarde");

    // Título
    sheet.mergeCells("A1", "D1");
    sheet.getCell("A1").value = `Informe Llegadas Tarde - Grupo ${selectedGroup || "Todos"}`;
    sheet.getCell("A1").font = { size: 16, bold: true };
    sheet.getCell("A1").alignment = { horizontal: "center" };

    // Encabezados
    const headers = ["Estudiante", "Identificación", "Fechas", "Cantidad"];
    const headerRow = sheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9D9D9" },
      };
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Filas con datos
    datosExport.forEach((dato) => {
      const row = sheet.addRow([
        dato.Estudiante,
        dato.Identificación,
        dato.Fechas,
        dato.Cantidad,
      ]);
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Ajustar ancho de columnas
    sheet.columns = [
      { width: 30 },
      { width: 20 },
      { width: 40 },
      { width: 10 },
    ];

    // Descargar
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Llegadas_Tarde_${selectedGroup || "Todos"}.xlsx`);
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  if (loading) return <SpinnerComponent />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="llegadasTardeContainer a4-size" ref={printRef}>
      <FiltroLlegadasTarde
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
      />

      <div className="table-container-llegadastarde">
        <h3>
          Llegadas tarde del grupo : <span>{selectedGroup}</span>
        </h3>
        <table className="llegadas-tarde-table">
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Identificación</th>
              <th>Fechas</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((llegada, index) => (
              <tr key={index}>
                <td>
                  {[
                    llegada.primer_apellido,
                  ]
                    .filter(Boolean)
                    .sort()
                    .concat(
                      [llegada.segundo_apellido, llegada.primer_nombre].filter(
                        Boolean
                      )
                    )
                    .join(" ")}
                </td>

                <td>{llegada.num_identificacion}</td>

                <td>
                  <ul className="fechas">
                    {llegada.fechas.map((date, idx) => {
                      const { day, month } = formatDate(date);
                      return (
                        <li key={idx}>
                          <span className="day">{day}</span>-
                          <span className="month">{month}</span>
                          {idx < llegada.fechas.length - 1 && ", "}
                        </li>
                      );
                    })}
                  </ul>
                </td>

                <td className="cantidad">{llegada.fechas.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ReactPaginate
          previousLabel={"<<"}
          nextLabel={">>"}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      </div>
      <button className="btn-llegadas-tarde" onClick={handleDownloadExcel}>
        Descargar Excel
      </button>
    </div>
  );
};

export default LlegadasTarde;
