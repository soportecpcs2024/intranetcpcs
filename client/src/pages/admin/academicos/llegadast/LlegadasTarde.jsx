import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { LlegadasTardeData } from "../../../../api/DataApi";
import FiltroLlegadasTarde from "../../../../components/FiltroLlegadasTarde";
import html2canvas from "html2canvas";
import ReactPaginate from 'react-paginate';
import "./LlegadasTarde.css";
import Logo from "/logo.png";
import SpinnerComponent from "../../../../components/SpinnerComponent";

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
      console.log(data);
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
      : llegadasTarde.filter(llegada => llegada.grupo.trim() === selectedGroup.trim());
  }, [selectedGroup, llegadasTarde]);

  useEffect(() => {
    const endOffset = (currentPage + 1) * ITEMS_PER_PAGE;
    setCurrentItems(filteredData.slice(currentPage * ITEMS_PER_PAGE, endOffset));
    setPageCount(Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  }, [currentPage, filteredData]);

  const formatDate = (date) => {
    return format(new Date(date), "dd/MM/yyyy");
  };

  const handleDownloadImage = () => {
    if (printRef.current) {
      html2canvas(printRef.current).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = "llegadas_tarde.png";
        link.click();
      });
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  if (loading) return <SpinnerComponent />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="llegadasTardeContainer a4-size" ref={printRef}>
      <div className="header-llegadastarde">
        <div>
          <img className="llegadaTarde-logo" src={Logo} alt="Logo CPCS" />
        </div>
        <div className="header-llegadastarde-text">
          <p>Carrera 83 No. 78-30 Medellín - Colombia</p>
          <p>PBX: 442 06 06</p>
          <p>https://colombosueco.com/</p>
          <h6 className="llegadasTardeContainer-title">Llegadas tarde</h6>
        </div>
      </div>
      <FiltroLlegadasTarde
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
      />

      <div className="table-container">
        <table className="llegadas-tarde-table">
          <thead>
            <tr>
              <th>Nombre estudiante</th>
              <th>Identificación</th>
              <th>Grupo</th>
              <th>Fechas</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((llegada, index) => (
              <tr key={index}>
                <td>{`${llegada.primer_nombre} ${
                  llegada.segundo_nombre ? llegada.segundo_nombre : ""
                } ${llegada.primer_apellido} ${llegada.segundo_apellido}`}</td>
                <td>{llegada.num_identificacion}</td>
                <td>{llegada.grupo}</td>
                <td>
                  <ul>
                    {llegada.fechas.map((date, idx) => (
                      <li key={idx}>{formatDate(date)}</li>
                    ))}
                  </ul>
                </td>
                <td className="cantidad">{llegada.fechas.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ReactPaginate
          previousLabel={'<<'}
          nextLabel={'>>'}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          activeClassName={'active'}
        />
      </div>
      <button className='btn-llegadas-tarde' onClick={handleDownloadImage}>Descargar Imagen</button>
    </div>
  );
};

export default LlegadasTarde;
