import React, { useEffect, useState } from 'react';
import { useRecaudo } from '../../../contexts/RecaudoContext';
import './ListaEPPagas.css';

const ListaEPPagas = () => {
  const { facturas } = useRecaudo();
  const [filteredData, setFilteredData] = useState([]);
  const [conteoPorCod, setConteoPorCod] = useState({});

  const codToNombre = {
    1400: 'El arte de ser Padres',
    1600: 'Guiando a sus adolescentes',
    1700: 'Mayordomía financiera',
  };

  const filterFacturas = () => {
    const codigosPermitidos = [1400, 1600, 1700];
    const result = [];
    const conteo = { 1400: 0, 1600: 0, 1700: 0 };

    facturas.forEach((factura) => {
      factura.clases.forEach((clase) => {
        if (codigosPermitidos.includes(clase.cod)) {
          conteo[clase.cod] += 1;
          result.push({
            idFactura: factura._id,
            nombreEstudiante: factura.estudianteId?.nombre || 'N/A',
            documento: factura.estudianteId?.documentoIdentidad || 'N/A',
            grado: factura.estudianteId?.grado || 'N/A',
            nombreClase: codToNombre[clase.cod] || clase.nombreClase,
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
    setConteoPorCod(conteo);
  };

  useEffect(() => {
    filterFacturas();

    const now = new Date();
    const next7am = new Date();
    next7am.setHours(7, 0, 0, 0);
    if (now > next7am) next7am.setDate(next7am.getDate() + 1);
    const delay = next7am - now;

    const timer = setTimeout(() => {
      filterFacturas();
      setInterval(filterFacturas, 24 * 60 * 60 * 1000);
    }, delay);

    return () => clearTimeout(timer);
  }, [facturas]);

  return (
    <div>
      <h3>Familias con Escuelas Pagas</h3>

      <div className="conteo-clases">
        {Object.entries(conteoPorCod).map(([cod, count]) => (
          <p key={cod}>
            {codToNombre[cod]}: {count} participación{count !== 1 ? 'es' : ''}
          </p>
        ))}
      </div>

      <ul>
        {filteredData.map((item, index) => (
          <li key={index}>
            <div className="lista_ep_pagas">
              <p>{item.nombreEstudiante} - {item.grado}</p>
              <p>Escuela: {item.nombreClase}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaEPPagas;
