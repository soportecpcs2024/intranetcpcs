import { useEffect, useState } from "react";
import { useRecaudo } from "../../../contexts/RecaudoContext";
import ReactPaginate from "react-paginate";
import * as XLSX from "xlsx";
import "./ListaEPPagas.css";

const ITEMS_PER_PAGE = 10;

const ListaEPPagas = () => {
  const { facturas, fetchFacturas } = useRecaudo(); 
  const [filteredData, setFilteredData] = useState([]);
  const [conteoClases, setConteoClases] = useState({});
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const formatFechaColombia = (fechaStr) => {
    if (!fechaStr) return "N/A";
    const date = new Date(fechaStr);
    return date.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "America/Bogota",
    });
  };

  // ✅ Recargar datos al montar el componente
  useEffect(() => {
    fetchFacturas?.(); // Llamar solo si existe
  }, [fetchFacturas]);

useEffect(() => {
  const codigosPermitidos = [1400, 1600, 1700, 2400];
  const conteo = { 1400: 0, 1600: 0, 1700: 0, 2400: 0 };
  const result = [];

  (facturas || []).forEach((factura) => {
    (factura.clases || []).forEach((clase) => {
      const codNum = Number(clase.cod); // ✅ clave

      if (codigosPermitidos.includes(codNum)) {
        conteo[codNum] += 1;

        result.push({
          idFactura: factura._id,
          nombreEstudiante: factura.estudianteId?.nombre || "N/A",
          documento: factura.estudianteId?.documentoIdentidad || "N/A",
          grado: factura.estudianteId?.grado || "N/A",
          nombreClase: clase.nombreClase,
          cod: codNum, // ✅ guardar como número
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

  // Ordenar por escuela
  result.sort((a, b) => getNombreEscuela(a.cod).localeCompare(getNombreEscuela(b.cod)));

  setFilteredData(result);
  setConteoClases(conteo);
}, [facturas]);


  useEffect(() => {
    const endOffset = (currentPage + 1) * ITEMS_PER_PAGE;
    setCurrentItems(
      filteredData.slice(currentPage * ITEMS_PER_PAGE, endOffset)
    );
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
      case 2400:
        return "Hablando de sexualidad en casa";
      default:
        return "Escuela Desconocida";
    }
  };

  const exportToExcel = () => {
    if (filteredData.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    // 🔹 Convertir los datos en un formato plano para Excel
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((item) => ({
        "Nombre Estudiante": item.nombreEstudiante,
        Documento: item.documento,
        Grado: item.grado,
        Escuela: getNombreEscuela(item.cod),
      }))
    );

    // 🔹 Crear libro y hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Facturas");

    // 🔹 Generar archivo Excel
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // 🔹 Guardar con file-saver
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(
      data,
      `Lista de familias activas en Escuelas de padres${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`
    );
  };

  return (
    <div className="container_lista_ep">
      <h3>Familias con Escuelas Pagas</h3>

      <div className="conteo-clases">
        <p>🧩 El arte de ser Padres: {conteoClases[1400] || 0}</p>
        <p>👨‍👧‍👦 Guiando a sus adolescentes: {conteoClases[1600] || 0}</p>
        <p>💰 Mayordomía financiera: {conteoClases[1700] || 0}</p>
        <p>💰 Hablando de sexualidad en casa: {conteoClases[2400] || 0}</p>
        <div>
          <p>
            Total familias activas : <p>{filteredData.length}</p>{" "}
          </p>
        </div>

        <button onClick={exportToExcel} className="btn-descargar">
          📥 Descargar Excel
        </button>
      </div>
      <table className="tabla-ep">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre Estudiante</th>
            <th>Grado</th>
            <th>Escuela</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index}>
              <td>{currentPage * ITEMS_PER_PAGE + index + 1}</td>
              <td>{item.nombreEstudiante}</td>
              <td>{item.grado}</td>
              <td >{getNombreEscuela(item.cod)}</td>
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
  );
};

export default ListaEPPagas;
