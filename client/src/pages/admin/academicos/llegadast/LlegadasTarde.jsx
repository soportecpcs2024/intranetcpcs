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
import domtoimage from "dom-to-image";
import ReactPaginate from "react-paginate";
import "./LlegadasTarde.css";
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

  const handleDownloadImage = () => {
    if (printRef.current) {
      const container = printRef.current;

      container.style.width = "auto";
      container.style.height = "auto";
      container.style.overflow = "visible";

      domtoimage
        .toPng(container)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "llegadas_tarde.png";
          link.click();
        })
        .catch((error) => {
          console.error("Error generating image:", error);
        })
        .finally(() => {
          container.style.width = "";
          container.style.height = "";
          container.style.overflow = "";
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
                    llegada.primer_apellido, // Solo este se ordenará si hay más elementos con el mismo apellido
                  ]
                    .filter(Boolean)
                    .sort()
                    .concat(
                      [llegada.segundo_apellido, llegada.primer_nombre].filter(
                        Boolean
                      )
                    ) // Los otros nombres se mantienen en su orden original
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
      <button className="btn-llegadas-tarde" onClick={handleDownloadImage}>
        Descargar Imagen
      </button>
    </div>
  );
};

export default LlegadasTarde;
