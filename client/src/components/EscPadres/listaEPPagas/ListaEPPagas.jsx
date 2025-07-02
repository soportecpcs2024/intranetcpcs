import React, { useEffect, useState } from 'react';
import { useRecaudo } from '../../../contexts/RecaudoContext'; // Ajusta la ruta si cambia
import './ListaEPPagas.css'

const ListaEPPagas = () => {
  const { facturas } = useRecaudo();
  const [filteredData, setFilteredData] = useState([]);

  const filterFacturas = () => {
    const codigosPermitidos = [1400, 1600, 1700];
    const result = [];

    facturas.forEach((factura) => {
      factura.clases.forEach((clase) => {
        if (codigosPermitidos.includes(clase.cod)) {
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
  };

  useEffect(() => {
    filterFacturas();

    // Calcular el tiempo hasta las 7:00 a.m.
    const now = new Date();
    const next7am = new Date();
    next7am.setHours(7, 0, 0, 0);
    if (now > next7am) next7am.setDate(next7am.getDate() + 1);
    const delay = next7am - now;

    const timer = setTimeout(() => {
      filterFacturas();
      setInterval(filterFacturas, 24 * 60 * 60 * 1000); // repetir cada 24 horas
    }, delay);

    return () => clearTimeout(timer);
  }, [facturas]);

  return (
    <div>
      <h3>Familias con escuelas Pagas</h3>
      <ul>
        {filteredData.map((item, index) => (
          <li key={index}>
            <div className='lista_ep_pagas'>
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
