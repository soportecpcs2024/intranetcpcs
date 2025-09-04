import { useEffect, useState } from 'react';
import { useRecaudo } from '../../../contexts/RecaudoContext';
import ReactPaginate from 'react-paginate';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './ListaEPPagas.css';

const ITEMS_PER_PAGE = 10;

const ListaEPPagas = () => {
  const { facturas, fetchFacturas } = useRecaudo();
  const [filteredData, setFilteredData] = useState([]);
  const [conteoClases, setConteoClases] = useState({});
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const formatFechaColombia = (fechaStr) => {
    if (!fechaStr) return 'N/A';
    const date = new Date(fechaStr);
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'America/Bogota',
    });
  };

  useEffect(() => {
    fetchFacturas?.();
  }, [fetchFacturas]);

  useEffect(() => {
    const codigosPermitidos = [1400, 1600, 1700];
    const conteo = { 1400: 0, 1600: 0, 1700: 0 };
    const result = [];

    facturas.forEach((factura) => {
      factura.clases.forEach((clase) => {
        if (codigosPermitidos.includes(clase.cod)) {
          conteo[clase.cod] += 1;

          result.push({
            idFactura: factura._id,
            nombreEstudiante: factura.estudianteId?.nombre || 'N/A',
            documento: factura.estudianteId?.documentoIdentidad || 'N/A',
            grado: factura.estudianteId?.grado || 'N/A',
            nombreClase: clase.nombreClase,
            escuela: getNombreEscuela(clase.cod),
            cod: clase.cod,
            dia: clase.dia,
            hora: clase.hora,
            total: factura.total,
            tipoPago: factura.tipoPago,
            mesAplicado: factura.mes_aplicado,
            fechaCompra: formatFechaColombia(factura.fechaCompra),
          });
        }
      });
    });

    result.sort((a, b) =>
      getNombreEscuela(a.cod).localeCompare(getNombreEscuela(b.cod))
    );

    setFilteredData(result);
    setConteoClases(conteo);
  }, [facturas]);

  useEffect(() => {
    const endOffset = (currentPage + 1) * ITEMS_PER_PAGE;
    setCurrentItems(filteredData.slice(currentPage * ITEMS_PER_PAGE, endOffset));
    setPageCount(Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  }, [currentPage, filteredData]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const getNombreEscuela = (cod) => {
    switch (cod) {
      case 1400:
        return "El arte de ser Padres";
      case 1600:
        return "Guiando a sus adolescentes";
      case 1700:
        return "Mayordomía financiera";
      default:
        return "Escuela Desconocida";
    }
  };

  // ✅ Calcular estudiantes únicos por documento
  const totalEstudiantesUnicos = new Set(
    filteredData.map((item) => item.documento)
  ).size;

  // ✅ Función para exportar a Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "EscuelasPagas");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "EscuelasPagas.xlsx");
  };

  return (
    <div className='container_lista_ep'>
      <h3>Familias con Escuelas Pagas</h3>

      <div className="conteo-clases">
        <p>🧩 El arte de ser Padres: {conteoClases[1400] || 0}</p>
        <p>👨‍👧‍👦 Guiando a sus adolescentes: {conteoClases[1600] || 0}</p>
        <p>💰 Mayordomía financiera: {conteoClases[1700] || 0}</p>
        <div>
          Total estudiantes pagos del mes:{" "}
          <span>{totalEstudiantesUnicos}</span>
        </div>
        {/* 🔽 Botón para descargar Excel */}
        <button onClick={exportToExcel} className="btn-export">
          📥 Descargar Excel
        </button>
      </div>

      <ul>
        {currentItems.map((item, index) => (
          <li key={index}>
            <div className="lista_ep_pagas">
              <p>{item.nombreEstudiante}</p>
              <p>{item.grado}</p>
              <p style={{ color: "red" }}>Escuela: {item.escuela}</p>
            </div>
          </li>
        ))}
      </ul>

      <ReactPaginate
        previousLabel={"<<"}
        nextLabel={">>"}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </div>
  );
};

export default ListaEPPagas;
