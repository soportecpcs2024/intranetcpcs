import React, { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { LlegadasTardeData } from "../../../../api/DataApi";
import FiltroLlegadasTarde from "../../../../components/FiltroLlegadasTarde";
import html2canvas from "html2canvas";
import "./LlegadasTarde.css";
import Logo from "/logo.png";

const LlegadasTarde = () => {
  const [llegadasTarde, setLlegadasTarde] = useState([]);
  const [filteredLlegadasTarde, setFilteredLlegadasTarde] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState("");
  const printRef = useRef();

  useEffect(() => {
    const fetchLlegadasTarde = async () => {
      try {
        const data = await LlegadasTardeData();
        setLlegadasTarde(data);
        setFilteredLlegadasTarde(data);
      } catch (err) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchLlegadasTarde();
  }, []);

  useEffect(() => {
    if (selectedGroup === "") {
      setFilteredLlegadasTarde(llegadasTarde);
    } else {
      setFilteredLlegadasTarde(
        llegadasTarde.filter(
          (llegada) => llegada.grupo.trim() === selectedGroup.trim()
        )
      );
    }
  }, [selectedGroup, llegadasTarde]);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="llegadasTardeContainer" ref={printRef}>
      <div className="header-llegadastarde">
        <div >
          <img className="llegadaTarde-logo" src={Logo} alt="Logo CPCS" />
        </div>
        <div className="header-llegadastarde-text">
          <p>Carrera 83 No. 78-30 Medellín - Colombia</p>
          <p> PBX: 442 06 06</p>
          <p>https://colombosueco.com/</p>
        </div>
      </div>
      <h3 className="llegadasTardeContainer-title">Llegadas tarde</h3>
      <FiltroLlegadasTarde
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
      />
    
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
          {filteredLlegadasTarde.map((llegada, index) => (
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
      <button  className='btn-llegadas-tarde' onClick={handleDownloadImage}>Descargar Imagen</button>
    </div>
  );
};

export default LlegadasTarde;
