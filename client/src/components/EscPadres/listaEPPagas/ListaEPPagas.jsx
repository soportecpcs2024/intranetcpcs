import { useEffect, useState } from 'react';
import { useRecaudo } from '../../../contexts/RecaudoContext';
import './ListaEPPagas.css';

const ListaEPPagas = () => {
  const { facturas } = useRecaudo();
  const [filteredData, setFilteredData] = useState([]);
  const [conteoClases, setConteoClases] = useState({});

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
            cod: clase.cod,
            dia: clase.dia,
            hora: clase.hora,
            total: factura.total,
            tipoPago: factura.tipoPago,
            mesAplicado: factura.mes_aplicado,
            fechaCompra: new Date(factura.fechaCompra).toLocaleDateString(),
          });
        }
      });
    });

    setFilteredData(result);
    setConteoClases(conteo);

    const now = new Date();
    const next7am = new Date();
    next7am.setHours(7, 0, 0, 0);
    if (now > next7am) next7am.setDate(next7am.getDate() + 1);
    const delay = next7am - now;

    const timer = setTimeout(() => {
      // Reejecutar el mismo filtro
      setFilteredData(result);
      setConteoClases(conteo);
      setInterval(() => {
        setFilteredData(result);
        setConteoClases(conteo);
      }, 24 * 60 * 60 * 1000);
    }, delay);

    return () => clearTimeout(timer);
  }, [facturas]);

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

  return (
    <div>
      <h3>Familias con Escuelas Pagas</h3>

      <div className="conteo-clases">
        <p>🧩 El arte de ser Padres: {conteoClases[1400] || 0}</p>
        <p>👨‍👧‍👦 Guiando a sus adolescentes: {conteoClases[1600] || 0}</p>
        <p>💰 Mayordomía financiera: {conteoClases[1700] || 0}</p>
      </div>

      <ul>
        {filteredData.map((item, index) => (
          <li key={index}>
            <div className="lista_ep_pagas">
              <p>{item.nombreEstudiante} - {item.grado}</p>
              <p>Escuela: {getNombreEscuela(item.cod)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaEPPagas;
